/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        merah: "#FF3B5C",
        tirai: "#C2122E",
        rose: "#FF7A93",
        krem: "#FFF4EE",
        emas: "#FFC857",
        ink: "#3A1018",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        hand: ['"Caveat"', "cursive"],
        body: ['"Quicksand"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
