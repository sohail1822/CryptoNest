/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Fintech Palette - Slightly lighter & more refined
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a3bcff',
          400: '#7a9bff',
          500: '#5c7cff', // Signature Blue
          600: '#4761ff',
          700: '#3a4edb',
          800: '#2f3ea9',
          900: '#2b3687',
          950: '#1a1f4d',
        },
        accent: {
          cyan: '#00e5ff',
          purple: '#9d5cff',
          pink: '#ff5cb8',
          green: '#00df9a', // Mint Green
          orange: '#ff9d42',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#2d3748', // Lightened again
          900: '#22293b', // Lightened again
          950: '#1a202e', // Lightened again (matches bg-main)
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.12)',
        'glow-purple': '0 0 20px rgba(157, 92, 255, 0.12)',
        'glow-green': '0 0 20px rgba(0, 223, 154, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-bubble': 'radial-gradient(circle at 20% 80%, rgba(0, 229, 255, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(157, 92, 255, 0.05) 0%, transparent 40%)',
        'gradient-card': 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
