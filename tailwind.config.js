/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,html,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
