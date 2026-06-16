"use client";

import { HistoryItem, RecognitionResponse } from "@/lib/types";

const HISTORY_KEY = "echoglyph.history";
const CANVAS_KEY = "echoglyph.canvas";

export function getSavedCanvas(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CANVAS_KEY);
}

export function saveCanvas(image: string) {
  window.localStorage.setItem(CANVAS_KEY, image);
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function addHistoryItem(drawing: string, result: RecognitionResponse): HistoryItem {
  const item: HistoryItem = {
    id: crypto.randomUUID(),
    drawing,
    createdAt: new Date().toISOString(),
    result
  };
  const next = [item, ...getHistory()].slice(0, 24);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));

  return item;
}

export function restoreHistoryItem(item: HistoryItem) {
  saveCanvas(item.drawing);
}
