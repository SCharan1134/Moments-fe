/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        secondary: "#FFF8ED",
        primary: "#FF8080",
        moment: "#FFF4E4",
      },
    },
  },
  plugins: [import("tailwindcss-animate"), import("daisyui")],
};
