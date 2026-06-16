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
  const group = result.group?.trim() || knownBand?.group || "Unknown band";
  const confidence = Math.min(98, Math.max(35, Math.round(Number(result.confidence ?? 62))));
  const topSongs = Array.isArray(result.topSongs) && result.topSongs.length > 0 ? result.topSongs.slice(0, 5) : knownBand?.topSongs;
  const alternatives = Array.isArray(result.alternatives)
    ? result.alternatives.filter(Boolean).slice(0, 3)
    : knownBand?.alternatives;

  if (!recognized || confidence < 55 || group.toLowerCase() === "unknown") {
    return {
      group: "No recognizable logo",
      confidence: Math.min(confidence, 54),
      alternatives: [],
      image: "none",
      accent: "#7df9ff",
      description:
        result.reason?.trim() ||
        result.description?.trim() ||
        "The drawing does not contain enough recognizable band-logo structure to make a reliable match.",
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
      recognized: true
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
      "AI recognized this as a music-related logo, but it is not in the local curated catalog yet.",
    topSongs: topSongs ?? ["Unknown track", "Unknown track", "Unknown track", "Unknown track", "Unknown track"],
    analyzedAt: new Date().toISOString(),
    source: "polza-ai",
    recognized: true
  };
}

export function hasPolzaConfig() {
  return Boolean(process.env.POLZA_AI_API_KEY);
}

export async function recognizeLogoWithPolza(image: string, features?: DrawingFeatures): Promise<RecognitionResponse> {
  const apiKey = process.env.POLZA_AI_API_KEY;

  if (!apiKey) {
    throw new Error("POLZA_AI_API_KEY is not configured.");
  }

  const model = process.env.POLZA_AI_MODEL || DEFAULT_MODEL;
  const catalog = bandCatalog.map((band) => band.group).join(", ");

  if (features && (features.inkRatio < 0.0025 || features.bboxCoverage < 0.01)) {
    return {
      group: "No recognizable logo",
      confidence: 0,
      alternatives: [],
      image: "none",
      accent: "#7df9ff",
      description: "The drawing is too small or sparse to identify as a band logo.",
      topSongs: [],
      analyzedAt: new Date().toISOString(),
      source: "polza-ai",
      recognized: false,
      reason: "too little visual information"
    };
  }

  const featureSummary = features
    ? `Canvas features: aspect=${features.aspectRatio.toFixed(2)}, ink=${features.inkRatio.toFixed(
        4
      )}, diagonal=${features.diagonalBias.toFixed(2)}, symmetry=${(
        (features.verticalSymmetry + features.horizontalSymmetry) /
        2
      ).toFixed(2)}, hue=${features.meanHue.toFixed(0)}.`
    : "Canvas features are unavailable.";

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
            "You are a conservative visual recognition engine for hand-drawn music band logos. Your first job is to reject non-logos, random marks, simple lines, dots, scribbles, blank canvases, and drawings without distinctive band-logo structure. Return only valid JSON. Do not add markdown."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this canvas as a possible hand-drawn music band logo. Prefer these local catalog bands only when the drawing is genuinely recognizable: ${catalog}. ${featureSummary}

Rules:
- If the drawing is blank, a single line, a simple stripe, a dot, random scribble, or too generic, return "recognized": false.
- If there is not enough distinctive visual evidence for a real band logo, return "recognized": false.
- Do not guess just to fill the answer.
- Use confidence below 55 when recognized is false.
- Only return recognized true when you can name a plausible band logo from visible features.

Return JSON with exactly:
{
  "recognized": true/false,
  "group": "Band name",
  "confidence": 0-100,
  "alternatives": ["Band 1", "Band 2", "Band 3"],
  "description": "One short sentence about why this logo matches",
  "topSongs": ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"],
  "reason": "Short reason when recognized is false"
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
    throw new Error(`Polza.ai recognition failed: ${response.status}`);
  }

  const data = (await response.json()) as PolzaResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Polza.ai returned an empty recognition response.");
  }

  return normalizeAiResult(parseJson(content));
}
