import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // @ts-ignore
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  vite: {
    ssr: {
      noExternal: ["axios", "form-data"],
    },
  },
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
      title: "آریا ساخت",
      link: [{ rel: "icon", type: "image/png", href: "/logo/logo.png" }],
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
