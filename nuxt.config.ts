// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "https://localhost:3000",
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/icon", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      script: [
        {
          type: "text/javascript",
          innerHTML: `!function(){var i="GFQj9A",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,

          tagPosition: "bodyClose",
        },
      ],
    },
  },
});
