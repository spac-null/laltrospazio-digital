
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        field: {
          quiet: "hsl(var(--field-quiet))",
          dense: "hsl(var(--field-dense))",
          "dense-foreground": "hsl(var(--field-dense-foreground))",
        },
        signal: {
          current: "hsl(var(--signal-current))",
          "current-foreground": "hsl(var(--signal-current-foreground))",
          notice: "hsl(var(--signal-notice))",
          "notice-foreground": "hsl(var(--signal-notice-foreground))",
          unverified: "hsl(var(--signal-unverified))",
        },
        primary: {
          DEFAULT: "hsl(var(--signal-current))",
          foreground: "hsl(var(--signal-current-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--field-dense))",
          foreground: "hsl(var(--field-dense-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--signal-notice))",
          foreground: "hsl(var(--signal-notice-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--field-quiet))",
          foreground: "hsl(var(--foreground))",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
