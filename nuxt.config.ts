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
    serverApiBase: process.env.SERVER_API_BASE_URL || "http://backend:3000/api",
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

  // Keep Nuxt Icon's local server endpoint outside the public /api namespace.
  // Nginx reserves /api/* for the NestJS backend.
  icon: {
    localApiEndpoint: "/_nuxt_icon",
  },

  hooks: {
    "pages:extend"(pages) {
      const legacyPanelMeta: Record<string, Record<string, unknown>> = {
        "/dashboard/profile": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "profile", action: "r" } },
        "/dashboard/orders": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "orders", action: "r" } },
        "/dashboard/carts": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "carts", action: "r" } },
        "/dashboard/fav": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "products", action: "r" } },
        "/dashboard/ticketing": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "ticketing", action: "r" } },
        "/dashboard/wallets": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "wallets", action: "r" } },
        "/dashboard/transaction": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "transaction", action: "r" } },
        "/dashboard/companies": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "companies", action: "r" } },
        "/dashboard/products": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "products", action: "r" } },
        "/dashboard/product_status": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "product_status", action: "r" } },
        "/dashboard/transporting": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "transporting", action: "r" } },
        "/dashboard/categories": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "categories", action: "r" } },
        "/dashboard/users": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "all", action: "m" } },
        "/dashboard/roles": { layout: "panel", middleware: ["auth", "permission"], permission: { resource: "all", action: "m" } },
      };

      for (const page of pages) {
        const meta = legacyPanelMeta[page.path];
        if (meta) page.meta = { ...page.meta, ...meta };
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
    // Panel navigation must never leave NuxtPage empty while a legacy panel
    // view is being resolved. The panel has its own loading/error states, so
    // replacing the page atomically here only creates a blank shell when a
    // chunk or API request is slow.
    pageTransition: false,
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
