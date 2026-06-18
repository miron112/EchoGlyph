"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, History, Music2 } from "lucide-react";
import { BandVisual } from "@/components/BandVisual";
import { getHistory, restoreHistoryItem } from "@/lib/storage";
import { HistoryItem } from "@/lib/types";

type HistoryListProps = {
  limit?: number;
  items?: HistoryItem[];
  showViewAll?: boolean;
};

export function HistoryList({ limit, items, showViewAll = false }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>(items ?? []);

  useEffect(() => {
    if (!items) {
      setHistory(getHistory());
    }
  }, [items]);

  const visibleItems = typeof limit === "number" ? history.slice(0, limit) : history;

  const openAgain = (item: HistoryItem) => {
    restoreHistoryItem(item);
    window.location.href = "/";
  };

  if (visibleItems.length === 0) {
    return (
      <section className="glass-panel p-6">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-neon" />
          <h2 className="text-xl font-black text-white">Ваша история</h2>
        </div>
        <div className="mt-5 rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
          <Music2 className="mx-auto h-8 w-8 text-white/35" />
          <p className="mt-3 text-sm text-white/50">Распознанные рисунки автоматически появятся здесь.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-neon" />
          <h2 className="text-xl font-black text-white">Ваша история</h2>
        </div>
        {showViewAll && (
          <Link href="/history" className="flex items-center gap-2 text-sm font-semibold text-neon hover:text-white">
            Показать всё
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="group rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-0.5 hover:border-neon/35 hover:bg-white/[0.07]"
          >
            <div className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#2b201e]">
                {/* eslint-disable-next-line @next/next/no-img-element -- Data URLs from localStorage are rendered directly. */}
                <img src={item.drawing} alt={`Рисунок логотипа ${item.result.group}`} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-white">{item.result.group}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/45">
                      <Calendar className="h-3 w-3" />
                      {new Intl.DateTimeFormat("ru-RU", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }).format(new Date(item.createdAt))}
                    </p>
                  </div>
                  <BandVisual image={item.result.image} group={item.result.group} accent={item.result.accent} compact />
                </div>
                <button type="button" onClick={() => openAgain(item)} className="mt-3 w-full rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-white/70 transition group-hover:border-neon/40 group-hover:text-white">
                  Открыть снова
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
