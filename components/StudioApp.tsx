"use client";

import { useState } from "react";
import { CanvasEditor } from "@/components/CanvasEditor";
import { HistoryList } from "@/components/HistoryList";
import { ResultPanel } from "@/components/ResultPanel";
import { HistoryItem, RecognitionResponse } from "@/lib/types";

export function StudioApp() {
  const [result, setResult] = useState<RecognitionResponse | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recentItems, setRecentItems] = useState<HistoryItem[] | undefined>();

  const handleHistoryItem = (item: HistoryItem) => {
    setRecentItems((current) => [item, ...(current ?? [])]);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase text-pulse">ИИ-лаборатория музыкальных логотипов</p>
        <h1 className="mt-3 text-balance text-4xl font-black text-white sm:text-6xl">
          Нарисуйте логотип. Найдите группу. Включите её хиты.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">
          EchoGlyph превращает наброски в совпадения с музыкальными группами, оценивает уверенность и предлагает лучшие композиции с помощью API распознавания.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,.85fr)]">
        <CanvasEditor onResult={setResult} onRecognizing={setRecognizing} onHistoryItem={handleHistoryItem} />
        <ResultPanel result={result} loading={recognizing} />
      </div>

      <div className="mt-6">
        <HistoryList limit={6} items={recentItems} showViewAll />
      </div>
    </main>
  );
}
