import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['apps/desktop/src/ui/**/*.{ts,tsx,html}'],
  theme: { extend: {} },
  plugins: []
} satisfies Config;
