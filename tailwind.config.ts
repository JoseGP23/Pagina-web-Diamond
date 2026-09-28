import type { Config } from 'tailwindcss';

const config: Config = {
  // Los estados :hover solo se aplican en dispositivos con puntero real.
  // En pantallas táctiles un toque ya no deja el hover "pegado".
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0a0a0a',
          light: '#141414',
        },
        gold: '#c9a876',
        fire: '#c0392b',
        bone: '#f5f0e8',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        condensed: ['var(--font-condensed)', 'sans-serif'],
      },
      transitionTimingFunction: {
        // Mismas curvas que lib/motion.ts, para que CSS y Framer Motion se sientan iguales.
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
