// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Nuxt Playground',
    },
  },
  colorMode: {
    classSuffix: '',
  },
  content: {
    experimental: { sqliteConnector: 'native' },
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      },
    },
  },
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
