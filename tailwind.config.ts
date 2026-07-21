import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.ts",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1673FF',
          yellow: '#FCC040',
        }
      },
      fontFamily: {
        yekan: ['"iran-yekan-num-Regular"', "sans-serif"],
        sans: ['"iran-yekan-num-Regular"', "sans-serif"],
      },
      borderRadius: {
        'brand': '12px',
      },
      boxShadow: {
        'premium': '0 4px 20px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'industrial': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;