import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 28px color-mix(in srgb, var(--game-primary) 45%, transparent)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.38)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-220% 0" },
          "100%": { backgroundPosition: "220% 0" }
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" }
        },
        pop: {
          "0%": { transform: "scale(0.86)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 220ms ease-out both",
        toastIn: "toastIn 180ms ease-out both"
      }
    }
  },
  plugins: []
} satisfies Config;

