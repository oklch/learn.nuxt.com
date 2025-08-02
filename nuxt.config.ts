// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  colorMode: {
    classSuffix: '',
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
  content: {
    experimental: { sqliteConnector: 'native' },
  },
})
