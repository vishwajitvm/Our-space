/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#0f0f14",
          card: "#17171f",
          soft: "#1d1d27",
          pink: "#ff4d8d",
          purple: "#8b5cf6",
          blue: "#5da9ff",
          muted: "#a0a0ad",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(255,77,141,0.18)",
        blueglow: "0 0 30px rgba(93,169,255,0.16)",
        purpleglow: "0 0 34px rgba(139,92,246,0.2)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at 22% 16%, rgba(255,77,141,.14), transparent 32%), radial-gradient(circle at 80% 4%, rgba(93,169,255,.12), transparent 29%), linear-gradient(180deg, #0f0f14 0%, #13131a 54%, #0f0f14 100%)",
      },
    },
  },
  plugins: [],
};
