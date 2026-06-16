import { BrainCircuit, Database, Paintbrush, Radio } from "lucide-react";

const features = [
  {
    title: "Canvas-first editor",
    text: "Mouse and touch drawing, brush controls, eraser, undo, redo, export, and reload recovery.",
    icon: Paintbrush
  },
  {
    title: "Recognition API",
    text: "The /api/recognize route accepts the drawing image and returns a clean JSON contract for future ML integration.",
    icon: BrainCircuit
  },
  {
    title: "Music profiles",
    text: "Each match includes visual identity, confidence, description, alternatives, and five top songs.",
    icon: Radio
  },
  {
    title: "Local history",
    text: "Search history stays in localStorage so users can reopen drawings after refreshes or later visits.",
    icon: Database
  }
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-pulse">About EchoGlyph</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">A recognition studio for musical marks.</h1>
          <p className="mt-5 text-base leading-7 text-white/60">
            EchoGlyph is a full-stack Next.js prototype for drawing band logos and receiving a polished music result. The current engine is mock AI by design, but the API boundary is ready for a real computer vision model.
          </p>
        </div>
        <div className="glass-panel overflow-hidden p-6">
          <div className="relative h-[360px] rounded-lg border border-white/10 bg-black/30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute left-8 top-8 h-24 w-24 rounded-lg border border-neon/30 bg-neon/10 shadow-glow" />
            <div className="absolute right-10 top-16 h-28 w-28 rounded-full border border-pulse/40 bg-pulse/10 shadow-magenta" />
            <div className="absolute bottom-10 left-12 right-12 rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-sm font-semibold text-neon">/api/recognize</p>
              <p className="mt-2 text-2xl font-black text-white">Canvas image to band profile</p>
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
