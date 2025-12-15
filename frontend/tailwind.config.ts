import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    { pattern: /(sm|md|lg|xl|2xl)?:grid-cols-(1|2|3|4)/ },
    { pattern: /(sm|md|lg|xl|2xl)?:gap-(2|3|4|5|6|8)/ },
  ],
  plugins: [],
};
export default config;
