import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080812",
        panel: "#111326",
        neon: "#7df9ff",
        pulse: "#ff4ecd",
        volt: "#b9ff5f"
      },
      boxShadow: {
        glow: "0 0 36px rgba(125, 249, 255, 0.18)",
        magenta: "0 0 34px rgba(255, 78, 205, 0.2)"
      },
      backgroundImage: {
        "stage-radial":
          "radial-gradient(circle at 18% 18%, rgba(255,78,205,.2), transparent 28%), radial-gradient(circle at 78% 12%, rgba(125,249,255,.18), transparent 28%), linear-gradient(135deg, #080812 0%, #101429 48%, #070713 100%)"
      }
    }
  },
  plugins: []
};

export default config;
