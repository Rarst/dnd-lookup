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
      typography: ({ theme }) => ({
        stone: {
          css: {
            "--tw-prose-body": theme("colors.black"),
            "--tw-prose-headings": theme("colors.black"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
