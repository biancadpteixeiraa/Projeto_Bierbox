/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-primary": "#D9D9D9",
        "gray-secondary": "#676767",
        "gray-tertiary": "#666666",
        "gray-quaternary": "#333333",
        "beige-primary": "#FAF8F1",
        "beige-secondary": "#FDF4D1",
        "yellow-primary": "#E29713",
        "yellow-secondary": "#FCBA27",
        "yellow-tertiary": "#FFE090",
        "brown-primary": "#5B4116",
        "brown-secondary": "#5C4418",
        "brown-tertiary": "#654A1F",
        "green-primary": "#1FCD00",
      },
      fontFamily:{
          primary: ['"Dela Gothic One"', 'sans-serif'],
          secondary: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

