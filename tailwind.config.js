/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1120px",
      },
    },
    extend: {
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        primary: "rgb(var(--fg) / <alpha-value>)",
        secondary: "rgb(var(--muted) / <alpha-value>)",
        tertiary: "rgb(var(--muted-2) / <alpha-value>)",
        border: "rgb(var(--line) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: {
          crimson: "rgb(var(--fg) / <alpha-value>)",
          glow: "rgb(var(--muted) / <alpha-value>)",
          forge: "rgb(var(--muted-2) / <alpha-value>)",
        },
        success: "#15803d",
        warning: "#a16207",
        glass: "rgb(var(--fg) / 0.04)",
      },
      borderColor: {
        DEFAULT: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        hand: ["Caveat", "ui-rounded", "cursive"],
      },
      maxWidth: {
        page: "768px",
        wide: "1120px",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
