/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#E60023", dark: "#AD081B", light: "#FF1A3D" },
        coral: { DEFAULT: "#FF6B6B", light: "#FF8A8A" },
        dark: { DEFAULT: "#111111", soft: "#1a1a1a", card: "#1E1E1E" },
        muted: { DEFAULT: "#888888", light: "#AAAAAA" },
        textPrimary: "#111111",
        textSecondary: "#555555",
        softBg: "#FAFAFA",
        cardBorder: "#EFEFEF",
        amber: { DEFAULT: "#FF9500", light: "#FFB340" },
      },
      fontFamily: {
        display: ["'Inter'", "system-ui", "sans-serif"],
        body: ["'Inter'", "'Lato'", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        pulse2: "pulse2 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(30px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        pulse2: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
