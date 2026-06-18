import { Disc3, Radio, Zap } from "lucide-react";

type BandVisualProps = {
  image: string;
  group: string;
  accent: string;
  compact?: boolean;
};

export function BandVisual({ image, group, accent, compact = false }: BandVisualProps) {
  const initials = group
    .split(/\s|\/|&/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-lg border border-white/10 bg-black/40",
        compact ? "h-20 w-20" : "h-52 w-full"
      ].join(" ")}
      style={{
        background:
          image === "nirvana"
            ? `radial-gradient(circle at center, ${accent} 0 8%, transparent 9% 100%), linear-gradient(135deg, #2a201d, #4a3529)`
            : image === "daftpunk"
              ? `linear-gradient(120deg, rgba(243,198,165,.22), rgba(231,166,161,.2)), linear-gradient(145deg, #241b1a, #49322f)`
              : image === "acdc"
                ? `linear-gradient(135deg, #2a1b18, #563426 55%, #241b1a)`
                : `linear-gradient(135deg, rgba(255,236,220,.07), ${accent}33), linear-gradient(145deg, #241b1a, #49322f)`
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/15" />
      <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full border border-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={[
            "grid place-items-center rounded-full border border-white/20 bg-black/45 shadow-glow backdrop-blur-md",
            compact ? "h-14 w-14" : "h-28 w-28"
          ].join(" ")}
        >
          {image === "daftpunk" ? (
            <Radio className={compact ? "h-7 w-7" : "h-12 w-12"} color={accent} />
          ) : image === "acdc" ? (
            <Zap className={compact ? "h-8 w-8" : "h-14 w-14"} color={accent} fill={accent} />
          ) : image === "queen" ? (
            <Disc3 className={compact ? "h-8 w-8" : "h-14 w-14"} color={accent} />
          ) : (
            <span
              className={[
                "font-black tracking-normal text-white drop-shadow",
                compact ? "text-lg" : "text-4xl"
              ].join(" ")}
            >
              {initials}
            </span>
          )}
        </div>
      </div>
      {!compact && (
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <p className="max-w-[70%] truncate text-sm font-semibold uppercase text-white/70">{group}</p>
          <div className="h-2 w-24 rounded-full" style={{ background: accent }} />
        </div>
      )}
    </div>
  );
}
