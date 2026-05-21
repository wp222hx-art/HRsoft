/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SiNova brand palette
        nova: {
          50:  '#eef9ff',
          100: '#d9f0ff',
          200: '#bbe4ff',
          300: '#8dd3ff',
          400: '#56b8ff',
          500: '#2e98ff',
          600: '#177af5',
          700: '#1463db',
          800: '#1751b0',
          900: '#19478b',
        },
        gold: {
          400: '#f5c451',
          500: '#e9a82a',
          600: '#c98615',
        },
        ink: {
          50:  '#f6f7fb',
          100: '#eceef5',
          800: '#1a1f2e',
          900: '#0f1320',
          950: '#080b14',
        },
        risk: {
          green:  '#16a34a',
          yellow: '#eab308',
          orange: '#f97316',
          red:    '#dc2626',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
               '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
      },
      keyframes: {
        'radar-sweep': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
