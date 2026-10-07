import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: "#faf7ff", 100: "#f3ecff", 200: "#e6d9ff", 300: "#d2b9ff",
          400: "#b98cfa", 500: "#a066ee", 600: "#8a45d9",
          700: "#7333b8", 800: "#5e2b94", 900: "#4a2275",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: { soft: "0 8px 30px -10px rgba(138,69,217,.35)" },
    },
  },
  plugins: [],
} satisfies Config;
