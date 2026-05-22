/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind which files to scan for class names
  // If a file isn't listed here, Tailwind won't generate CSS for it
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Custom green color for our brand — used as bg-brand, text-brand, etc.
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      // Custom font
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}