/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        surface: "#131D2D",
        "surface-2": "#1D2B40",
        edge: "rgba(218,231,244,0.12)",
        violet: {
          DEFAULT: "#21B89A",
          bright: "#63D8BD",
          dim: "#126B61"
        },
        amber: {
          DEFAULT: "#FF806D",
          dim: "#A94A4B"
        },
        text: {
          DEFAULT: "#E5EEF7",
          muted: "#95A8BD",
          faint: "#61748C"
        },
        live: "#A8D86E"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(33,184,154,0.16), transparent)"
      }
    }
  },
  plugins: []
};
