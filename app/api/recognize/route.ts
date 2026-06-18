import { NextRequest, NextResponse } from "next/server";
import { recognizeLogo } from "@/lib/recognition";
import { hasPolzaConfig, recognizeLogoWithPolza } from "@/lib/polza";
import { RecognitionRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RecognitionRequest;

  if (!body.image || !body.image.startsWith("data:image/")) {
    return NextResponse.json({ message: "Необходимо изображение с холста." }, { status: 400 });
  }

  const allowHeuristicFallback = process.env.RECOGNITION_FALLBACK === "heuristic";

  if (!hasPolzaConfig() && !allowHeuristicFallback) {
    return NextResponse.json(
      {
        message:
          "Ключ API Polza.ai не настроен. Создайте файл .env.local с POLZA_AI_API_KEY или задайте RECOGNITION_FALLBACK=heuristic для локального демонстрационного режима."
      },
      { status: 503 }
    );
  }

  try {
    return NextResponse.json(await recognizeLogoWithPolza(body.image, body.features));
  } catch (error) {
    console.error(error);

    if (!allowHeuristicFallback) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Не удалось выполнить распознавание через Polza.ai. Проверьте ключ API, название модели, баланс и доступность сервиса."
        },
        { status: 502 }
      );
    }
  }

  const result = recognizeLogo(body.image, body.features);

  return NextResponse.json(result);
}
