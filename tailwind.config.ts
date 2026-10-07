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
        archive: {
          paper: "#F5F1E8",
          weathered: "#E8E1D3",
          night: "#202523",
        },
        carbon: {
          ink: "#171A1A",
        },
        graphite: {
          annotation: "#5E625F",
        },
        terracotta: {
          DEFAULT: "#A94C35",
          hover: "#8E3D29",
          clay: "#E8C7B9",
        },
        sage: {
          DEFAULT: "#61705A",
        },
        night: {
          base: "#202523",
          paper: "#F7F3EB",
          muted: "rgba(247, 243, 235, 0.65)",
        },
        quiet: {
          rule: "rgba(23, 26, 26, 0.16)",
          night: "rgba(247, 243, 235, 0.16)",
        },
        bg: {
          base: "#F5F1E8",
          elevated: "#E8E1D3",
          contrast: "#202523",
        },
        ink: {
          primary: "#171A1A",
          secondary: "#5E625F",
          muted: "rgba(23, 26, 26, 0.45)",
          contrast: "#F7F3EB",
        },
        accent: {
          terracotta: "#A94C35",
          warm: "#A94C35",
          light: "#F7F3EB",
        },
        status: {
          online: "#61705A",
          error: "#A94C35",
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "6px",
        btn: "4px",
        input: "4px",
        modal: "8px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
