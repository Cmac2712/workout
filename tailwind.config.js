const { colors, radius } = require("./src/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      borderRadius: {
        surface: radius.surface,
        control: radius.control,
      },
    },
  },
  plugins: [],
};
