/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E15",
        surface: "#131A28",
        "surface-2": "#1A2337",
        edge: "rgba(234,236,242,0.09)",
        violet: {
          DEFAULT: "#6E5BFF",
          bright: "#8B7BFF",
          dim: "#443B99"
        },
        amber: {
          DEFAULT: "#FFB648",
          dim: "#8A6A33"
        },
        text: {
          DEFAULT: "#EAECF2",
          muted: "#8891A5",
          faint: "#5A6479"
        },
        live: "#3DDC84"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(110,91,255,0.16), transparent)"
      }
    }
  },
  plugins: []
};
