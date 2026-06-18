import Link from "next/link";
import { AudioLines, History, Info, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Студия", icon: Sparkles },
  { href: "/history", label: "История", icon: History },
  { href: "/about", label: "О проекте", icon: Info }
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink shadow-glow">
            <AudioLines className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-black text-white">EchoGlyph</span>
            <span className="block text-xs text-white/45">студия распознавания логотипов</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
