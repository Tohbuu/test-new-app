import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f7fb',
          100: '#e3e9f2',
          200: '#c8d2e2',
          300: '#9fb0c9',
          400: '#7187a8',
          500: '#4a5f7e',
          600: '#33445d',
          700: '#223148',
          800: '#141d2e',
          900: '#0b111c',
        },
        aurora: {
          50: '#ecfdf7',
          100: '#d0faea',
          200: '#a4f1d8',
          300: '#6fe3c0',
          400: '#3ccaa2',
          500: '#1aa385',
          600: '#12816b',
          700: '#106753',
          800: '#0f5344',
          900: '#0d4439',
        },
        ember: {
          50: '#fff3ed',
          100: '#ffe2d2',
          200: '#ffc4aa',
          300: '#ffa070',
          400: '#ff7b3d',
          500: '#f75a1e',
          600: '#dd4313',
          700: '#b43213',
          800: '#92291a',
          900: '#79251a',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(6, 11, 20, 0.45)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'radial-sheen': 'radial-gradient(circle at top, rgba(60,202,162,0.18), transparent 44%), radial-gradient(circle at 80% 20%, rgba(247,90,30,0.14), transparent 28%)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -10px, 0) scale(1.02)' },
        },
      },
      animation: {
        drift: 'drift 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
