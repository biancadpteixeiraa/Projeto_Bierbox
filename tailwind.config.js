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
        "beige-hover":"#F3EFDE",
        "beige-disabled":"#eceae4",
        "beige-secondary": "#FDF4D1",
        "yellow-primary": "#E29713",
        "yellow-disabled": "#cb922d",
        "yellow-hover": "#B3780F",
        "yellow-secondary": "#FCBA27",
        "yellow-secondary-hover": "#EDA403",
        "yellow-secondary-disabled": "#e6b037",
        "yellow-tertiary": "#FFE090",
        "brown-primary": "#5B4116",
        "brown-secondary": "#5C4418",
        "brown-tertiary": "#654A1F",
        "green-primary": "#1FCD00",
        "green-hover": "#179A00",
        "green-disabled": "#52a444",
        "blue-primary": "#2B75FF",
        "blue-hover": "#0050e6",
      },
      fontFamily:{
          primary: ['"Dela Gothic One"', 'sans-serif'],
          secondary: ['Montserrat', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '90rem',
      },
      size: {
        '38': '9.5rem',
      }
    },
  },
  plugins: [],
}

