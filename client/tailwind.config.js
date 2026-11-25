/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', '"Noto Sans Devanagari"', 'sans-serif'],
        heading: ['"Philosopher"', '"Noto Sans Devanagari"', 'serif'],
        serif: ['"Philosopher"', '"Noto Sans Devanagari"', 'serif'],
      },
      colors: {
        vedic: {
          bg: '#FFF8EC',
          alt: '#FBEBD0',
          card: '#FFFFFF',
          border: '#EBD5B0',
          primary: '#E65100',
          primaryHover: '#BF360C',
          gold: '#C8961E',
          heading: '#4A1C0C',
          body: '#5D4037',
          muted: '#8D6E63',
          maroon: '#3B1208',
          cream: '#FFF1D6',
          whatsapp: '#25D366',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(74, 28, 12, 0.08)',
        'card-hover': '0 14px 32px rgba(74, 28, 12, 0.14)',
      },
    },
  },
  plugins: [],
};
