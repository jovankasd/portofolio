import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#f4f0e8",
          elevated: "#e9e2d6",
          contrast: "#1d1b18",
        },
        ink: {
          primary: "#1d1b18",
          secondary: "rgba(29, 27, 24, 0.72)",
          muted: "rgba(29, 27, 24, 0.48)",
          contrast: "#f4f0e8",
        },
        accent: {
          terracotta: "#bd4b2a",
          warm: "#d67b5a",
          light: "#f8f3e9",
        },
        status: {
          online: "#2e7d32",
          error: "#c62828",
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        card: "6px",
        btn: "4px",
        modal: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
