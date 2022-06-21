const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Alegreya Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Alegreya", ...defaultTheme.fontFamily.serif],
        "serif-sc": [
          "Alegreya SC",
          "Alegreya",
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [],
};
