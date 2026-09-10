/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mine: {
          950: '#0a0e17',
          900: '#0d1321',
          850: '#111827',
          800: '#1a2235',
          700: '#243049',
          600: '#2d3d5c',
          500: '#3a4f73',
        },
        risk: {
          safe: '#22c55e',
          'safe-dim': '#166534',
          advisory: '#eab308',
          'advisory-dim': '#854d0e',
          high: '#f97316',
          'high-dim': '#9a3412',
          critical: '#ef4444',
          'critical-dim': '#991b1b',
        },
        accent: {
          cyan: '#06b6d4',
          'cyan-dim': '#0e7490',
          blue: '#3b82f6',
          'blue-dim': '#1d4ed8',
          purple: '#8b5cf6',
          indigo: '#6366f1',
        },
        glass: {
          light: 'rgba(255,255,255,0.05)',
          medium: 'rgba(255,255,255,0.08)',
          heavy: 'rgba(255,255,255,0.12)',
          border: 'rgba(255,255,255,0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-alert': 'pulse-alert 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'gauge-fill': 'gaugeFill 1.5s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-alert': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        gaugeFill: {
          '0%': { strokeDashoffset: '283' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
