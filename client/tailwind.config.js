/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "green-slide": "#219725",
        "purple-slide": "#69256E",
        "red-slide": "#EB3D49",
        "orange-slide": "#CB7D28",
        "blue-slide": "#286A9A",
      },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
