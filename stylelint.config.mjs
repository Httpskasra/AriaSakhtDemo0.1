export default {
  customSyntax: "postcss-html",
  ignoreFiles: ["**/node_modules/**", "**/.nuxt/**", "**/.output/**", "assets/css/main.css"],
  rules: {
    "color-no-invalid-hex": true,
    "declaration-no-important": true,
    "no-duplicate-selectors": true,
    "selector-class-pattern": [
      "^(?!container$)[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)*$",
      { message: "از کلاس container عمومی استفاده نکنید؛ کلاس معنایی یا Token محور بسازید." },
    ],
    "declaration-property-value-disallowed-list": {
      "background": ["/^#|rgb\\(|rgba\\(/"],
      "background-color": ["/^#|rgb\\(|rgba\\(/"],
      "border": ["/#|rgb\\(|rgba\\(/"],
      "border-color": ["/#|rgb\\(|rgba\\(/"],
      "box-shadow": ["/#|rgb\\(|rgba\\(/"],
      "color": ["/^#|rgb\\(|rgba\\(/"],
      "outline": ["/#|rgb\\(|rgba\\(/"],
    },
  },
};
