import { bandCatalog } from "@/lib/bands";
import { DrawingFeatures, RecognitionResponse } from "@/lib/types";

type PolzaChoice = {
  message?: {
    content?: string;
  };
};

type PolzaResponse = {
  choices?: PolzaChoice[];
};

type AiRecognition = {
  recognized?: boolean;
  group?: string;
  confidence?: number;
  alternatives?: string[];
  description?: string;
  topSongs?: string[];
  reason?: string;
};

const POLZA_API_URL = "https://polza.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o";

function findKnownBand(group?: string) {
  if (!group) {
    return null;
  }

  const normalized = group.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    bandCatalog.find((band) => band.group.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized) ??
    bandCatalog.find((band) => normalized.includes(band.group.toLowerCase().replace(/[^a-z0-9]/g, ""))) ??
    null
  );
}

function parseJson(content: string): AiRecognition {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : trimmed;
  return JSON.parse(candidate) as AiRecognition;
}

function normalizeAiResult(result: AiRecognition): RecognitionResponse {
  const recognized = result.recognized !== false;
  const knownBand = findKnownBand(result.group);
  const group = result.group?.trim() || knownBand?.group || "Неизвестная группа";
  const confidence = Math.min(98, Math.max(35, Math.round(Number(result.confidence ?? 62))));
  const topSongs = Array.isArray(result.topSongs) && result.topSongs.length > 0 ? result.topSongs.slice(0, 5) : knownBand?.topSongs;
  const alternatives = Array.isArray(result.alternatives)
    ? result.alternatives.filter(Boolean).slice(0, 3)
    : knownBand?.alternatives;

  if (!recognized || confidence < 55 || group.toLowerCase() === "unknown") {
    return {
      group: "Логотип не распознан",
      confidence: Math.min(confidence, 54),
      alternatives: [],
      image: "none",
      accent: "#7df9ff",
      description:
        result.reason?.trim() ||
        result.description?.trim() ||
        "В рисунке недостаточно узнаваемых элементов логотипа музыкальной группы для надёжного сопоставления.",
      topSongs: [],
      analyzedAt: new Date().toISOString(),
      source: "polza-ai",
      recognized: false,
      reason: result.reason
    };
  }

  if (knownBand) {
    return {
      ...knownBand,
      group: knownBand.group,
      confidence,
      alternatives: alternatives ?? knownBand.alternatives,
      description: result.description?.trim() || knownBand.description,
      topSongs: topSongs ?? knownBand.topSongs,
      analyzedAt: new Date().toISOString(),
      source: "polza-ai",
      recognized: true,
      catalogMatch: true
    };
  }

  return {
    group,
    confidence,
    alternatives: alternatives ?? [],
    image: "ai",
    accent: "#7df9ff",
    description:
      result.description?.trim() ||
      "ИИ распознал музыкальный логотип, но его пока нет в локальном каталоге.",
    topSongs: topSongs ?? ["Неизвестная композиция", "Неизвестная композиция", "Неизвестная композиция", "Неизвестная композиция", "Неизвестная композиция"],
    analyzedAt: new Date().toISOString(),
    source: "polza-ai",
    recognized: true,
    catalogMatch: false
  };
}

export function hasPolzaConfig() {
  return Boolean(process.env.POLZA_AI_API_KEY);
}

export async function recognizeLogoWithPolza(image: string, features?: DrawingFeatures): Promise<RecognitionResponse> {
  const apiKey = process.env.POLZA_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Переменная POLZA_AI_API_KEY не настроена.");
  }

  const model = process.env.POLZA_AI_MODEL || DEFAULT_MODEL;
  const catalog = bandCatalog.map((band) => band.group).join(", ");

  if (features && (features.inkRatio < 0.0025 || features.bboxCoverage < 0.01)) {
    return {
      group: "Логотип не распознан",
      confidence: 0,
      alternatives: [],
      image: "none",
      accent: "#7df9ff",
      description: "Рисунок слишком маленький или разреженный, чтобы распознать в нём логотип группы.",
      topSongs: [],
      analyzedAt: new Date().toISOString(),
      source: "polza-ai",
      recognized: false,
      reason: "слишком мало визуальной информации"
    };
  }

  const featureSummary = features
    ? `Canvas features: aspect=${features.aspectRatio.toFixed(2)}, ink=${features.inkRatio.toFixed(
        4
      )}, diagonal=${features.diagonalBias.toFixed(2)}, symmetry=${(
        (features.verticalSymmetry + features.horizontalSymmetry) /
        2
      ).toFixed(2)}, hue=${features.meanHue.toFixed(0)}.`
    : "Характеристики холста недоступны.";

  const response = await fetch(POLZA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Ты — осторожная система визуального распознавания нарисованных от руки логотипов музыкальных исполнителей и групп со всего мира. Ты можешь определять любых реальных исполнителей и группы, включая русскоязычных. Сначала отбрасывай изображения, которые не являются логотипами: случайные знаки, простые линии, точки, каракули, пустые холсты и рисунки без характерной структуры музыкального логотипа. Всегда отвечай на русском языке. Возвращай только допустимый JSON без Markdown."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Проанализируй этот холст как возможный нарисованный от руки логотип музыкального исполнителя или группы. Не ограничивайся локальным каталогом: если логотип узнаваем, можно указать любого реального исполнителя или группу, включая русскоязычных. Локальный каталог нужен только для улучшенного отображения известных совпадений и не является белым списком: ${catalog}. ${featureSummary}

Правила:
- Если рисунок пустой, состоит из одной линии, простой полосы, точки, случайных каракулей или слишком общий, верни "recognized": false.
- Если недостаточно характерных визуальных признаков настоящего логотипа группы, верни "recognized": false.
- Не угадывай только ради заполнения ответа.
- Не подгоняй ответ под локальный каталог.
- Когда recognized равно false, confidence должно быть меньше 55.
- Возвращай recognized true только тогда, когда видимые элементы явно напоминают известный музыкальный логотип, талисман, эмблему, фирменное написание или символ исполнителя.
- Если логотип принадлежит реальному исполнителю или группе вне локального каталога, укажи их название.
- Для topSongs по возможности верни пять известных песен распознанного исполнителя.
- Поля description и reason обязательно заполняй на русском языке. Названия исполнителей и песен сохраняй в оригинале.

Верни JSON строго следующего вида:
{
  "recognized": true/false,
  "group": "Название группы",
  "confidence": 0-100,
  "alternatives": ["Группа 1", "Группа 2", "Группа 3"],
  "description": "Одно короткое предложение о причине совпадения",
  "topSongs": ["Песня 1", "Песня 2", "Песня 3", "Песня 4", "Песня 5"],
  "reason": "Краткая причина, если recognized равно false"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high"
              }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Ошибка распознавания Polza.ai: ${response.status}`);
  }

  const data = (await response.json()) as PolzaResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Polza.ai вернул пустой ответ распознавания.");
  }

  return normalizeAiResult(parseJson(content));
}
