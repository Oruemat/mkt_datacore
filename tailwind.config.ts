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
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            600: "#2563EB",
            700: "#1D4ED8",
          },
          orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            500: "#F97316",
            600: "#EA580C",
          },
          green: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            600: "#16A34A",
            700: "#15803D",
          },
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            900: "#111827",
          },
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
