import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#dbeafe",
          500: "#0f62fe",
          600: "#0b53d6",
          700: "#093b95"
        },
        success: "#0e9f6e",
        warning: "#c27803",
        danger: "#d92d20"
      },
      boxShadow: {
        card: "0 6px 24px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
