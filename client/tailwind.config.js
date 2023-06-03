/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      spacing: {
        168: "168px",
        316: "316px",
        464: "464px",
        612: "612px",
      },
      top: {
        168: "168px",
        316: "316px",
        464: "464px",
        612: "612px",
      },
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
