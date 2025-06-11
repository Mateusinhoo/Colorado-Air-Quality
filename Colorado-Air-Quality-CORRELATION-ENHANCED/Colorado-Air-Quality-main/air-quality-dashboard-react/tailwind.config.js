module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b0ff',
          400: '#3396ff',
          500: '#1E90FF', // Dodger Blue (primary)
          600: '#0066cc',
          700: '#004d99',
          800: '#003366',
          900: '#001a33',
        },
        secondary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4CAF50', // Green (secondary)
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        accent: {
          50: '#e1f5fe',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03A9F4', // Light Blue (accent)
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },
        background: '#F8FAFC', // Off-white
        text: '#1F2937', // Dark Gray
      },
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 20px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'breath': 'breath 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
