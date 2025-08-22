// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
    ssr: false,

    runtimeConfig: {
      public: {
        apiBase: process.env.API_BASE_URL
      }
    }
})