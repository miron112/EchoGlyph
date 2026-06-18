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
        ink: "#241b1a",
        panel: "#382a27",
        neon: "#f3c6a5",
        pulse: "#e7a6a1",
        volt: "#d8c99b"
      },
      boxShadow: {
        glow: "0 0 36px rgba(243, 198, 165, 0.2)",
        magenta: "0 0 34px rgba(231, 166, 161, 0.2)"
      },
      backgroundImage: {
        "stage-radial":
          "radial-gradient(circle at 18% 18%, rgba(231,166,161,.2), transparent 30%), radial-gradient(circle at 78% 12%, rgba(243,198,165,.18), transparent 30%), linear-gradient(135deg, #241b1a 0%, #382a27 48%, #201817 100%)"
      }
    }
  },
  plugins: []
};

export default config;
