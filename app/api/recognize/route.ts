import { NextRequest, NextResponse } from "next/server";
import { recognizeLogo } from "@/lib/recognition";
import { hasPolzaConfig, recognizeLogoWithPolza } from "@/lib/polza";
import { RecognitionRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RecognitionRequest;

  if (!body.image || !body.image.startsWith("data:image/")) {
    return NextResponse.json({ message: "Canvas image is required." }, { status: 400 });
  }

  const allowHeuristicFallback = process.env.RECOGNITION_FALLBACK === "heuristic";

  if (!hasPolzaConfig() && !allowHeuristicFallback) {
    return NextResponse.json(
      {
        message:
          "Polza.ai API key is not configured. Create .env.local with POLZA_AI_API_KEY, or set RECOGNITION_FALLBACK=heuristic for local mock mode."
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
              : "Polza.ai recognition failed. Check the API key, model name, balance, and provider availability."
        },
        { status: 502 }
      );
    }
  }

  const result = recognizeLogo(body.image, body.features);

  return NextResponse.json(result);
}
