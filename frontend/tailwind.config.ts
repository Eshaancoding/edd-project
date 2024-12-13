import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fontFamily: {
        'sans': ['"Mona Sans"', 'sans-serif'],
        'serif': ['Newsreader', 'Georgia', 'serif'],
    },
    extend: {
        colors: {
            
        }
    }
  },

  plugins: []
} satisfies Config;
