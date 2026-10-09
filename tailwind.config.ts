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
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          bright: "var(--color-surface-bright)",
          container: {
            lowest: "var(--color-surface-container-lowest)",
            low: "var(--color-surface-container-low)",
            DEFAULT: "var(--color-surface-container)",
            high: "var(--color-surface-container-high)",
            highest: "var(--color-surface-container-highest)",
          }
        },
        "on-surface": {
          DEFAULT: "var(--color-on-surface)",
          variant: "var(--color-on-surface-variant)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
        },
        "on-primary": {
          DEFAULT: "var(--color-on-primary)",
        },
        outline: {
          DEFAULT: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },
        tertiary: {
          "fixed-dim": "var(--color-tertiary-fixed-dim)",
        },
        
        // Retained for backward compatibility temporarily
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
        "display-hero": ["var(--font-space-grotesk)", "sans-serif"],
        "headline-xl": ["var(--font-space-grotesk)", "sans-serif"],
        "headline-lg": ["var(--font-space-grotesk)", "sans-serif"],
        "headline-md": ["var(--font-space-grotesk)", "sans-serif"],
        "headline-sm": ["var(--font-space-grotesk)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"],
        "body-sm": ["var(--font-inter)", "sans-serif"],
        "label-uppercase": ["var(--font-space-grotesk)", "sans-serif"],
        "label-nav": ["var(--font-inter)", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "9999px",
        pill: "9999px",
        input: "12px",
        modal: "16px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
