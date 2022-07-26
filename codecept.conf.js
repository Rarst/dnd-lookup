const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./tests/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http://localhost:4173",
      show: true,
      browser: "chromium",
      waitForNavigation: "networkidle",
    },
  },
  include: {},
  bootstrap: null,
  mocha: {},
  name: "dnd",
};
