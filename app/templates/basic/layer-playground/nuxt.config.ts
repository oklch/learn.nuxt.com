import { version as versionNuxt } from 'nuxt/package.json'
import { version as versionVue } from 'vue'

export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    '~/layer-playground/styles/base.css',
  ],
  runtimeConfig: {
    public: {
      clientInfo: {
        versionNuxt,
        versionVue,
      },
    },
  },
  vite: {
    warmupEntry: false,
    optimizeDeps: {
      include: [
        'birpc',
        'ufo',
        'ofetch',
        'defu',
      ],
    },
  },
  typescript: {
    includeWorkspace: true,
    tsConfig: {
      include: [
        '../layer-playground/**/*',
      ],
    },
  },
})
