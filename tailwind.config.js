/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#5D2962",
        accent: "#FFB84C",
        alt: "#4CA2A8",
        dark: "#251B2E",
        light: "#F5F5F5",
        gray: "#BDBDBD",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Ensure Inter is the default sans-serif font
      },
      backgroundPosition: {
        right: "right",
        left: "left",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(-100%)" }, // same as -translate-y-full
          "100%": { transform: "translateX(0)" }, // same as -translate-y-0
        },
        bgSlide: {
          "0%": { backgroundPosition: "-200% center" }, // Start far right
          "100%": { backgroundPosition: "0% center" }, // End at left
        },
      },
      animation: {
        slideDown: "slideDown 3s ease-out forwards",
        bgSlide: "bgSlide 1s ease-out forwards", // Slower and more visible
      },
    },
  },
  plugins: [],
};
