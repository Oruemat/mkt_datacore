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
        dc: {
          navy: "#0F172A",
          electric: "#1D4ED8",
          sky: "#64B5F6",
          orange: "#F97316",
          surface: "#F8FAFC",
          muted: "#64748B",
        },
      },
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
