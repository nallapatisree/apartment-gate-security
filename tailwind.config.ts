import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5EF",
        paper2: "#EFECE3",
        ink: {
          DEFAULT: "#182229",
          800: "#1D2B33",
          700: "#243541",
          600: "#324756",
          400: "#5C7382",
          300: "#8CA0AC",
        },
        line: {
          DEFAULT: "#D9D4C6",
          light: "#E8E4D8",
        },
        signal: {
          amber: "#E2A63B",
          amberDark: "#B9822A",
          green: "#3E8B63",
          greenDark: "#2E6B4C",
          red: "#B5443B",
          redDark: "#8E332C",
          blue: "#3B6EA5",
        },
      },
      fontFamily: {
        head: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
