/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {},
    colors: {
      lightprimary: "#FFFFFF",
      darkprimary: "#2C2F33",
      lightsecondary: "#6A5ACD",
      darksecondary: "#7289DA",
      lightinline: "#23272A",
      darkinline: "#FFEFD5",
      lightinteractive: "#2E8A99",
      darkinteractive: "#6A5ACD",
      lightprimarysubtle: "#F6F5F1",
      darkprimarysubtle: "#C5C6C7",
      transparent: "transparent",
      correct: "green-600",
      wrong: "red-600",
      gray: "gray-300",
      darkgray: "gray-600",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
