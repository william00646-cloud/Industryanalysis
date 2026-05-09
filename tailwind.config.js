/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          subtle: '#f1f5f9',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        'ticker-scroll': 'ticker-scroll 50s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'ticker-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
