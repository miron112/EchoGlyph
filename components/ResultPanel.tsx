"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CircleOff, ListMusic, Percent, Sparkles } from "lucide-react";
import { BandVisual } from "@/components/BandVisual";
import { RecognitionResponse } from "@/lib/types";

type ResultPanelProps = {
  result: RecognitionResponse | null;
  loading?: boolean;
};

export function ResultPanel({ result, loading = false }: ResultPanelProps) {
  if (loading) {
    return (
      <div className="glass-panel grid min-h-[520px] place-items-center p-8 text-center">
        <div>
          <div className="mx-auto mb-5 grid h-16 w-16 animate-pulse place-items-center rounded-full border border-neon/40 bg-neon/10">
            <Sparkles className="h-7 w-7 text-neon" />
          </div>
          <h2 className="text-xl font-bold text-white">Распознаём символ</h2>
          <p className="mt-2 text-sm text-white/55">Сопоставляем линии, силуэты и ритм логотипа.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel min-h-[520px] p-6">
        <div className="flex h-full min-h-[460px] flex-col justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-neon" />
          <h2 className="mt-5 text-2xl font-black text-white">Нарисуйте логотип группы</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/55">
            Сделайте набросок, нажмите «Распознать», и EchoGlyph найдёт наиболее похожую группу и предложит её песни.
          </p>
        </div>
      </div>
    );
  }

  if (result.recognized === false) {
    return (
      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel min-h-[520px] p-6"
      >
        <div className="flex h-full min-h-[460px] flex-col justify-center rounded-lg border border-dashed border-neon/20 bg-neon/[0.035] p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-neon/35 bg-neon/10">
            <CircleOff className="h-8 w-8 text-neon" />
          </div>
          <p className="mt-6 text-sm font-semibold text-neon">Надёжного совпадения нет</p>
          <h2 className="mt-2 text-3xl font-black text-white">Логотип не распознан</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/58">{result.description}</p>
          <div className="mx-auto mt-6 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase text-white/35">Уверенность</p>
            <p className="mt-1 text-xl font-black text-white">{result.confidence}%</p>
          </div>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel overflow-hidden p-5"
    >
      <BandVisual image={result.image} group={result.group} accent={result.accent} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-neon">
            <BadgeCheck className="h-4 w-4" />
            {result.catalogMatch === false ? "Совпадение от ИИ" : "Лучшее совпадение"}
          </p>
          <h2 className="mt-1 text-3xl font-black text-white">{result.group}</h2>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-right">
          <p className="flex items-center gap-1 text-xs text-white/45">
            <Percent className="h-3 w-3" />
            Уверенность
          </p>
          <p className="text-xl font-black text-white">{result.confidence}%</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/62">{result.description}</p>

      <div className="mt-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <ListMusic className="h-4 w-4 text-pulse" />
          Лучшие песни
        </p>
        <div className="space-y-2">
          {result.topSongs.map((song, index) => (
            <motion.div
              key={song}
              whileHover={{ x: 4, scale: 1.01 }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-neon/40 hover:bg-neon/[0.06]"
            >
              <span className="text-sm font-medium text-white">{song}</span>
              <span className="text-xs font-bold text-white/35">{String(index + 1).padStart(2, "0")}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
        <p className="text-xs font-semibold uppercase text-white/35">Другие варианты</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.alternatives.map((item) => (
            <span key={item} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
