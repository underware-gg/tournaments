/** @type {import('tailwindcss').Config} */

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgba(var(${variable}), ${opacityValue})`;
  };
}

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
        'primary':  withOpacityValue('--color-primary'),
        'primary-dark': withOpacityValue('--color-primary-dark'),
        'primary-darker': withOpacityValue('--color-primary-darker'),
        'retro-grey': 'rgba(34, 34, 34, 1)',
        'destructive': withOpacityValue('--color-destructive'),
        'warning': withOpacityValue('--color-warning'),
        'success': withOpacityValue('--color-success'),
      },
      fontFamily: {
        'astronaut': ['AstroNaut', 'sans-serif']
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

