import { BrainCircuit, Database, Paintbrush, Radio } from "lucide-react";

const features = [
  {
    title: "Удобный редактор",
    text: "Рисование мышью и касанием, настройка кисти, ластик, отмена и повтор действий, экспорт и восстановление после перезагрузки.",
    icon: Paintbrush
  },
  {
    title: "API распознавания",
    text: "Маршрут /api/recognize принимает изображение рисунка и возвращает структурированный JSON для будущей интеграции с моделью машинного обучения.",
    icon: BrainCircuit
  },
  {
    title: "Музыкальные профили",
    text: "Каждый результат содержит визуальный образ, оценку уверенности, описание, другие варианты и пять лучших песен.",
    icon: Radio
  },
  {
    title: "Локальная история",
    text: "История поиска хранится в браузере, поэтому рисунки можно открыть снова после обновления страницы или при следующем посещении.",
    icon: Database
  }
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-pulse">О проекте EchoGlyph</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Студия распознавания музыкальных символов.</h1>
          <p className="mt-5 text-base leading-7 text-white/60">
            EchoGlyph — полнофункциональный прототип на Next.js для рисования логотипов групп и получения подробного музыкального результата. Текущий движок использует демонстрационный ИИ, а API уже подготовлен для подключения настоящей модели компьютерного зрения.
          </p>
        </div>
        <div className="glass-panel overflow-hidden p-6">
          <div className="relative h-[360px] rounded-lg border border-white/10 bg-black/30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute left-8 top-8 h-24 w-24 rounded-lg border border-neon/30 bg-neon/10 shadow-glow" />
            <div className="absolute right-10 top-16 h-28 w-28 rounded-full border border-pulse/40 bg-pulse/10 shadow-magenta" />
            <div className="absolute bottom-10 left-12 right-12 rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-sm font-semibold text-neon">/api/recognize</p>
              <p className="mt-2 text-2xl font-black text-white">От рисунка к профилю группы</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="glass-panel p-6 transition hover:-translate-y-0.5 hover:border-neon/30">
              <Icon className="h-7 w-7 text-neon" />
              <h2 className="mt-4 text-xl font-black text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
