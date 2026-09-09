import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fffaf4",
        leaf: "#71a885",
        mint: "#dff3e8",
        peach: "#ffd9ca",
        berry: "#b35f72",
        ink: "#394240",
        sun: "#ffcf6e",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(89, 92, 75, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
