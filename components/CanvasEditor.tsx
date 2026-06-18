"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eraser,
  Paintbrush,
  Redo2,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Undo2
} from "lucide-react";
import { addHistoryItem, getSavedCanvas, saveCanvas } from "@/lib/storage";
import { DrawingFeatures, HistoryItem, RecognitionResponse } from "@/lib/types";

type CanvasEditorProps = {
  onResult: (result: RecognitionResponse) => void;
  onRecognizing: (recognizing: boolean) => void;
  onHistoryItem: (item: HistoryItem) => void;
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 760;
const blankState = "blank";

function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return { hue: hue * 60, saturation, lightness };
}

function extractCanvasFeatures(context: CanvasRenderingContext2D): DrawingFeatures {
  const { data } = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let count = 0;
  let minX = CANVAS_WIDTH;
  let minY = CANVAS_HEIGHT;
  let maxX = 0;
  let maxY = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let sumXY = 0;
  let hueX = 0;
  let hueY = 0;
  let saturation = 0;
  let brightness = 0;

  for (let y = 0; y < CANVAS_HEIGHT; y += 1) {
    for (let x = 0; x < CANVAS_WIDTH; x += 1) {
      const index = (y * CANVAS_WIDTH + x) * 4;
      const alpha = data[index + 3];

      if (alpha < 24) {
        continue;
      }

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const hsl = rgbToHsl(red, green, blue);
      const radians = (hsl.hue * Math.PI) / 180;

      count += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      sumX += x;
      sumY += y;
      sumXX += x * x;
      sumYY += y * y;
      sumXY += x * y;
      hueX += Math.cos(radians);
      hueY += Math.sin(radians);
      saturation += hsl.saturation;
      brightness += hsl.lightness;
    }
  }

  if (count === 0) {
    return {
      inkRatio: 0,
      aspectRatio: 1,
      bboxCoverage: 0,
      centerX: 0.5,
      centerY: 0.5,
      diagonalBias: 0,
      diagonalDirection: 0,
      verticalSymmetry: 0,
      horizontalSymmetry: 0,
      roundness: 0,
      meanHue: 0,
      saturation: 0,
      brightness: 0
    };
  }

  const width = Math.max(1, maxX - minX + 1);
  const height = Math.max(1, maxY - minY + 1);
  const meanX = sumX / count;
  const meanY = sumY / count;
  const varianceX = sumXX / count - meanX * meanX;
  const varianceY = sumYY / count - meanY * meanY;
  const covariance = sumXY / count - meanX * meanY;
  const symmetry = measureSymmetry(data, minX, minY, maxX, maxY);
  const hue = (Math.atan2(hueY / count, hueX / count) * 180) / Math.PI;

  return {
    inkRatio: count / (CANVAS_WIDTH * CANVAS_HEIGHT),
    aspectRatio: width / height,
    bboxCoverage: (width * height) / (CANVAS_WIDTH * CANVAS_HEIGHT),
    centerX: meanX / CANVAS_WIDTH,
    centerY: meanY / CANVAS_HEIGHT,
    diagonalBias: Math.min(1, Math.abs(covariance) / Math.max(1, varianceX + varianceY)),
    diagonalDirection: covariance / Math.max(1, varianceX + varianceY),
    verticalSymmetry: symmetry.vertical,
    horizontalSymmetry: symmetry.horizontal,
    roundness: Math.max(0, 1 - Math.abs(width - height) / Math.max(width, height)),
    meanHue: hue < 0 ? hue + 360 : hue,
    saturation: saturation / count,
    brightness: brightness / count
  };
}

function measureSymmetry(data: Uint8ClampedArray, minX: number, minY: number, maxX: number, maxY: number) {
  const step = 10;
  let verticalMatches = 0;
  let verticalTotal = 0;
  let horizontalMatches = 0;
  let horizontalTotal = 0;

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const mirroredX = maxX - (x - minX);
      const alpha = data[(y * CANVAS_WIDTH + x) * 4 + 3] > 24 ? 1 : 0;
      const mirroredAlpha = data[(y * CANVAS_WIDTH + mirroredX) * 4 + 3] > 24 ? 1 : 0;
      verticalMatches += alpha === mirroredAlpha ? 1 : 0;
      verticalTotal += 1;
    }
  }

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const mirroredY = maxY - (y - minY);
      const alpha = data[(y * CANVAS_WIDTH + x) * 4 + 3] > 24 ? 1 : 0;
      const mirroredAlpha = data[(mirroredY * CANVAS_WIDTH + x) * 4 + 3] > 24 ? 1 : 0;
      horizontalMatches += alpha === mirroredAlpha ? 1 : 0;
      horizontalTotal += 1;
    }
  }

  return {
    vertical: verticalTotal ? verticalMatches / verticalTotal : 0,
    horizontal: horizontalTotal ? horizontalMatches / horizontalTotal : 0
  };
}

export function CanvasEditor({ onResult, onRecognizing, onHistoryItem }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [brushSize, setBrushSize] = useState(12);
  const [brushColor, setBrushColor] = useState("#f3c6a5");
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [history, setHistory] = useState<string[]>([blankState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [status, setStatus] = useState("Ready to draw");

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d") ?? null;
  }, []);

  const canvasToImage = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL("image/png") : "";
  }, []);

  const getFeatures = useCallback(() => {
    const context = getContext();
    return context ? extractCanvasFeatures(context) : null;
  }, [getContext]);

  const restoreImage = useCallback(
    (image: string) => {
      const context = getContext();
      if (!context) {
        return;
      }

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.globalCompositeOperation = "source-over";

      if (image === blankState) {
        saveCanvas("");
        return;
      }

      const element = new Image();
      element.onload = () => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(element, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        saveCanvas(image);
      };
      element.src = image;
    },
    [getContext]
  );

  const pushHistory = useCallback(() => {
    const image = canvasToImage();
    setHistory((current) => {
      const next = [...current.slice(0, historyIndex + 1), image].slice(-35);
      setHistoryIndex(next.length - 1);
      return next;
    });
    saveCanvas(image);
  }, [canvasToImage, historyIndex]);

  useEffect(() => {
    const context = getContext();
    if (!context) {
      return;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    const saved = getSavedCanvas();
    if (saved) {
      restoreImage(saved);
      setHistory([blankState, saved]);
      setHistoryIndex(1);
    }
  }, [getContext, restoreImage]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
    };
  };

  const beginDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);
    setStatus(tool === "eraser" ? "Erasing" : "Drawing");
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return;
    }

    const context = getContext();
    const lastPoint = lastPointRef.current;
    if (!context || !lastPoint) {
      return;
    }

    const point = getPoint(event);
    context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = brushColor;
    context.lineWidth = tool === "eraser" ? brushSize * 2.2 : brushSize;
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  };

  const endDraw = () => {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    lastPointRef.current = null;
    pushHistory();
    setStatus("Saved locally");
  };

  const clearCanvas = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    pushHistory();
    setStatus("Canvas cleared");
  };

  const undo = () => {
    const nextIndex = Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIndex);
    restoreImage(history[nextIndex]);
    setStatus("Undo");
  };

  const redo = () => {
    const nextIndex = Math.min(history.length - 1, historyIndex + 1);
    setHistoryIndex(nextIndex);
    restoreImage(history[nextIndex]);
    setStatus("Redo");
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = canvasToImage();
    link.download = `echoglyph-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    setStatus("Drawing exported");
  };

  const recognize = async () => {
    const image = canvasToImage();
    const features = getFeatures();
    onRecognizing(true);
    setStatus("Recognizing");

    try {
      const response = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, features })
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(error?.message || "Recognition failed");
      }

      const result = (await response.json()) as RecognitionResponse;
      onResult(result);
      if (result.recognized !== false) {
        onHistoryItem(addHistoryItem(image, result));
        setStatus(`Matched ${result.group}`);
      } else {
        setStatus("No recognizable logo found");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Recognition failed");
    } finally {
      onRecognizing(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel overflow-hidden p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neon">Paint studio</p>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Draw the soundmark</h1>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/55">
          {status}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#2b201e] shadow-glow">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={beginDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerCancel={endDraw}
          onPointerLeave={endDraw}
          className="block h-[430px] w-full touch-none cursor-crosshair bg-[radial-gradient(circle_at_50%_50%,rgba(243,198,165,.1),transparent_36%),linear-gradient(rgba(255,236,220,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,236,220,.045)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px] sm:h-[560px]"
          aria-label="Band logo drawing canvas"
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/40 backdrop-blur">
          1200 x 760
        </div>
      </div>

      <div className="mt-4 grid gap-3 2xl:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              title="Brush"
              onClick={() => setTool("brush")}
              className={tool === "brush" ? "icon-button active" : "icon-button"}
            >
              <Paintbrush className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Eraser"
              onClick={() => setTool("eraser")}
              className={tool === "eraser" ? "icon-button active" : "icon-button"}
            >
              <Eraser className="h-4 w-4" />
            </button>
            <label title="Brush color" className="grid h-10 w-10 cursor-pointer place-items-center rounded-md border border-white/10 bg-white/[0.06]">
              <span className="h-5 w-5 rounded-full border border-white/25" style={{ backgroundColor: brushColor }} />
              <input
                aria-label="Brush color"
                type="color"
                value={brushColor}
                onChange={(event) => setBrushColor(event.target.value)}
                className="sr-only"
              />
            </label>
          </div>

          <label className="flex min-w-[210px] flex-1 basis-[260px] items-center gap-3 text-sm font-medium text-white/65">
            <span className="whitespace-nowrap">Size</span>
            <input
              type="range"
              min="2"
              max="46"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
              className="min-w-0 flex-1 accent-neon"
            />
            <span className="w-8 text-right text-white">{brushSize}</span>
          </label>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button type="button" title="Undo" onClick={undo} disabled={historyIndex === 0} className="icon-button">
              <Undo2 className="h-4 w-4" />
            </button>
            <button type="button" title="Redo" onClick={redo} disabled={historyIndex >= history.length - 1} className="icon-button">
              <Redo2 className="h-4 w-4" />
            </button>
            <button type="button" title="Clear canvas" onClick={clearCanvas} className="icon-button">
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" title="Save drawing" onClick={downloadImage} className="icon-button">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 2xl:justify-end">
          <button type="button" onClick={clearCanvas} className="secondary-button">
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
          <button type="button" onClick={downloadImage} className="secondary-button">
            <Save className="h-4 w-4" />
            Save
          </button>
          <button type="button" onClick={recognize} className="primary-button">
            <Sparkles className="h-4 w-4" />
            Recognize
          </button>
        </div>
      </div>
    </motion.section>
  );
}
