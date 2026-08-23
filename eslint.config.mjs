import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default tseslint.config(
  {
    ignores: [".nuxt/**", ".output/**", "node_modules/**", "coverage/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    rules: {
      // Nuxt auto-imports composables and browser globals are resolved by the
      // framework, not by ESLint's static scope analyzer.
      "no-undef": "off",
      "no-redeclare": "off",
      "no-useless-catch": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
  {
    files: ["**/*.{ts,mts,cts,js,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
);
