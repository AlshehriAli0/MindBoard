/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      margin: {
        "-2.5": "-0.625rem",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
});
