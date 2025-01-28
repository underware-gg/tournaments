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
        'retro-grey': 'rgba(34, 34, 34, 1)',
      },
      fontFamily: {
        'astronaut': ['AstroNaut', 'sans-serif']
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

