/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./index.html"  // Added for Vite compatibility
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
  safelist: [
    // Essential theme background classes
    'bg-gradient-to-br',
    'from-indigo-50', 'to-blue-50',
    'from-emerald-50', 'to-teal-50',
    'from-rose-50', 'to-pink-50',
    'from-amber-50', 'to-yellow-50',
    'from-purple-50', 'to-violet-50',
    'from-cyan-50', 'to-sky-50',
    // Add the specific tailwind classes that we use with opacity modifiers
    {
      pattern: /bg-(primary|secondary|accent)\/\d+/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /text-(primary|secondary|accent)\/\d+/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /ring-(primary|secondary|accent)\/\d+/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /shadow-(primary|secondary|accent)\/\d+/,
      variants: ['hover', 'focus', 'active']
    }
  ]
}

