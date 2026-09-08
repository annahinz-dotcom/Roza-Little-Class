/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9EF',
        honey: '#E6A93D',
        'honey-dark': '#C98F28',
        dusty: '#6F91A8',
        'dusty-dark': '#587994',
        coral: '#D97D68',
        sage: '#91A982',
        navy: '#243746',
        card: '#FFFDF9'
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '22px',
        pill: '999px'
      },
      boxShadow: {
        soft: '0 2px 10px rgba(36, 55, 70, 0.06)',
        softer: '0 1px 4px rgba(36, 55, 70, 0.05)'
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px) rotate(-3deg)' },
          '75%': { transform: 'translateX(6px) rotate(3deg)' }
        }
      }
    }
  },
  plugins: []
}
