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
      fontFamily: {
        yekan: ['"iran-yekan-num-Regular"', "sans-serif"], // کلاس سفارشی
        sans: ['"iran-yekan-num-Regular"', "sans-serif"], // جایگزین پیش‌فرض
      },
    },
  },
  plugins: [],
};

export default config;
