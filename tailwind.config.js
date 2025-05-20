/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-orange": "#F47458",
        "custom-gray": "#969AB8",
      },
    },
  },
  plugins: [],
};
