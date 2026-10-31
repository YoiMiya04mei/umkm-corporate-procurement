import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          navy: "#101D32",
          "navy-light": "#172A46",
          "navy-dark": "#0B1424",
          blue: "#183B63",
          "blue-hover": "#214C7E",
          "blue-light": "#EBF2F9",
          gold: "#C8A96B",
          "gold-hover": "#B69553",
          "gold-light": "#F7F2E7",
          "light-gray": "#F4F6F9",
          border: "#E2E8F0",
          text: "#1E293B",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
      boxShadow: {
        corporate: "0 4px 20px -2px rgba(16, 29, 50, 0.08)",
        "corporate-lg": "0 10px 30px -4px rgba(16, 29, 50, 0.12)",
        gold: "0 4px 14px 0 rgba(200, 169, 107, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;

