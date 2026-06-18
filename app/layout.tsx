import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoGlyph | Распознавание музыкальных логотипов",
  description: "Нарисуйте музыкальный логотип, найдите группу и откройте её лучшие песни."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen bg-stage-radial text-white">
          <div className="noise-layer" />
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
