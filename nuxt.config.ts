import process from "node:process";
import { defineNuxtConfig } from "nuxt/config";

const BRAND_BLUE = "#1673ff";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },

  experimental: {
    appManifest: false,
    payloadExtraction: false
  },

  nitro: {
    compressPublicAssets: true,
    timing: true,
    externals: {
      inline: ['entities']
    },
    routeRules: {
      "/dashboard": { redirect: "/dashboard/products" },
    },
  },

  vite: {
    ssr: {
      noExternal: ["axios", "form-data", "@nuxt/ui", "@nuxt/icon", "vue", "entities", "estree-walker"],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      chunkSizeWarningLimit: 2000
    },
    optimizeDeps: {
      include: ['vue', '@nuxt/ui', 'entities', 'estree-walker']
    }
  },

  build: {
    transpile: ["vue", "@nuxt/ui", "@nuxt/icon", "ofetch", "hookable"]
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || "https://tejaris.ir",
      apiBase: process.env.API_BASE_URL || "http://localhost:3001/api",
      paymentAllowedOrigins: (process.env.PAYMENT_ALLOWED_ORIGINS || "https://gateway.zibal.ir,https://sandbox.zibal.ir")
        .split(',')
        .map((origin: string) => origin.trim())
        .filter(Boolean),
    },
  },

  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/icon", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],

  hooks: {
    "pages:extend"(pages) {
      if (process.env.NODE_ENV !== "production" || process.env.ENABLE_TEST_PAGES === "true") return;
      const productionExcludedPaths = new Set(["/test", "/dashboard"]);
      for (let index = pages.length - 1; index >= 0; index -= 1) {
        if (productionExcludedPaths.has(pages[index].path)) pages.splice(index, 1);
      }
    },
  },

  image: {
    domains: ['picsum.photos', 'tejaris.ir'],
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: '**.tejaris.ir',
      }
    ]
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false
    },
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa'
      },
      titleTemplate: 'تجاریس | %s',
      title: 'پلتفرم صنعتی',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'مرکز مبادلات کالا و خدمات صنعتی کشور' }
      ]
    }
  },

  compatibilityDate: "2026-07-21"
});
