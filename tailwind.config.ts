import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lacivert: "#22314E",
        "lacivert-koyu": "#182338",
        zemin: "#EDEFF3",
        kagit: "#FFFFFF",
        muhur: "#B3261E",
        cizgi: "#D8DDE5",
        metin: "#1B2430",
        soluk: "#5B6472",
      },
      fontFamily: {
        belge: ["Georgia", "'Times New Roman'", "Times", "serif"],
      },
      boxShadow: {
        kagit: "0 1px 2px rgba(20,28,45,.08), 0 12px 32px rgba(20,28,45,.14)",
      },
    },
  },
  plugins: [],
};
export default config;
