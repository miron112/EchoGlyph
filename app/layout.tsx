import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoGlyph | Music Logo Recognition",
  description: "Draw a music logo and discover a likely band with top songs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
