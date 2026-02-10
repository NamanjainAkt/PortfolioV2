/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        elevated: "#1A1A1A",
        primary: "#EDEDED",
        secondary: "#A0A0A0",
        tertiary: "#6B6B6B",
        accent: {
          crimson: "#C8102E",
          glow: "#FF6B6B",
          forge: "#8B0000",
        },
        border: "#2A2A2A",
        success: "#0D7C66",
        warning: "#F5A623",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Placeholder, will need to import Inter or similar
        serif: ["Playfair Display", "serif"], // Placeholder
        mono: ["JetBrains Mono", "monospace"], // Placeholder
      },
    },
  },
  plugins: [],
};
