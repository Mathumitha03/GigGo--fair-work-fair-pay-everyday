/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf6',
          100: '#fffbf0',
          200: '#fff8e1',
          DEFAULT: '#fff8e1',
          300: '#fdeec7',
          400: '#f8de9e',
        },
        pastel: {
          50: '#f4f8f7',
          100: '#e6f0ed',
          200: '#cce1dc',
          300: '#b2d3cc',
          DEFAULT: '#a3c4bc',
          400: '#a3c4bc',
          500: '#6f9e94',
          600: '#4b7d73',
          700: '#39635b',
          800: '#2b4d47',
        },
        brand: {
          50: '#f0f7f5',
          100: '#dceee9',
          200: '#bce0d7',
          300: '#a3c4bc',
          400: '#6f9e94',
          500: '#4b7d73',
          600: '#39635b',
          700: '#2b4d47',
          800: '#203c37',
          900: '#172c28',
        },
        surface: {
          DEFAULT: '#fff8e1',
          card: '#ffffff',
          panel: '#f9f6ea',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 25px 60px -15px rgba(57, 99, 91, 0.12), 0 10px 25px -5px rgba(57, 99, 91, 0.05)',
        'floating': '0 12px 30px -8px rgba(57, 99, 91, 0.1), 0 4px 12px -2px rgba(57, 99, 91, 0.04)',
        'glass': '0 8px 32px 0 rgba(163, 196, 188, 0.15)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
