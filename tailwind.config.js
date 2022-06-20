/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        paper: "#f2ece4",
        "green-bg": "#e0e5c1",
        decoration: {
          100: "#e7d29b",
          200: "#c9ad6a",
          300: "#b89a67",
        },
        red: {
          logo: "#ed1c24",
          statblock: "#9c2b1b",
          header: "#58180d",
        },
      },
    },
  },
  plugins: [],
};
