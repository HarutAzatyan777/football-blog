module.exports = {
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-geist-sans)'],
          mono: ['var(--font-geist-mono)'],
        },
      },
    },
    plugins: [],
  };
  