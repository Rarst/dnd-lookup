const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Alegreya Sans",
          "Alegreya Sans-fallback",
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          "Alegreya",
          "Alegreya-fallback",
          ...defaultTheme.fontFamily.serif,
        ],
        "serif-sc": [
          "Alegreya SC",
          "Alegreya SC-fallback",
          "Alegreya",
          "Alegreya-fallback",
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
