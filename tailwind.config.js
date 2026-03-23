/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"Space Mono"', 'monospace'],
        sans:    ['Syne', '"Helvetica Neue"', 'sans-serif'],
      },
      colors: {
        bg:     '#060606',
        surface:'#0d0d0d',
        ink:    '#F2EDE4',
        muted:  'rgba(242,237,228,0.4)',
        pink:   '#FF4B8F',
        purple: '#7C3AED',
        green:  '#00FF87',
        border: 'rgba(255,255,255,0.07)',
      },
      backgroundImage: {
        'grad-pink-purple': 'linear-gradient(135deg, #FF4B8F, #7C3AED)',
      },
    },
  },
  plugins: [],
}
