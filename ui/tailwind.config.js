/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        'retro-green': 'rgba(0, 218, 163, 1)',
        'retro-green-dark': 'rgba(0, 140, 105, 1)',
      },
      fontFamily: {
        // Add your new font family
        'astronaut': ['AstroNaut', 'sans-serif']  // Replace YourFontName with your font's name
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

