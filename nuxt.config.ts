import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },

  experimental: {
    appManifest: false,
    payloadExtraction: false
  },

  nitro: {
    compressPublicAssets: true,
    timing: true
  },

  vite: {
    ssr: {
      noExternal: ["axios", "form-data", "@nuxt/ui", "@nuxt/icon", "vue"],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      chunkSizeWarningLimit: 2000
    },
    optimizeDeps: {
      include: ['vue', '@nuxt/ui']
    }
  },

  build: {
    transpile: ["vue", "@nuxt/ui", "@nuxt/icon", "ofetch", "hookable"]
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:3001/api",
    },
  },

  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/icon", "@nuxt/image", "@nuxt/ui", "@pinia/nuxt"],

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

  colorMode: {
    preference: 'light'
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa'
      },
      titleTemplate: 'تجاریس | %s',
      title: 'پلتفرم صنعتی بیست‌وبی',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'مرکز مبادلات کالا و خدمات صنعتی کشور' }
      ]
    }
  },

  loadingIndicator: {
    name: 'pulse',
    color: '#1673ff',
    background: 'white'
  },

  compatibilityDate: "2026-07-21"
});
