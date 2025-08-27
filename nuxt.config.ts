import { execaSync } from 'execa'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@pinia/nuxt',
    'floating-vue/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Nuxt Tutorial',
      htmlAttrs: {
        lang: 'en-US',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  site: {
    url: 'https://learnnuxtcom.netlify.app',
    name: 'Nuxt Tutorial',
  },
  colorMode: {
    classSuffix: '',
  },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        rehypePlugins:
        {
          'rehype-external-links': {
            options: {
              target: '_blank',
              rel: ['nofollow', 'noopener', 'noreferrer'],
            },
          },
        },
        highlight: {
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      buildTime: Date.now(),
      gitSha: execaSync('git', ['rev-parse', 'HEAD']).stdout,
      repoUrl: 'https://github.com/oklch/learn.nuxt.com',
    },
    app: {
      devtools: {
        iframeProps: {
          allow: 'cross-origin-isolated',
          credentialless: true,
        },
      },
    },
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
    externals: {
      inline: ['unhead'],
    },
  },
  vite: {
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    optimizeDeps: {
      include: [
        'monaco-editor/esm/vs/editor/editor.worker',
        'monaco-editor-core/esm/vs/editor/editor.worker',
        'typescript/lib/tsserverlibrary',
        '@vue/language-service',
        '@volar/monaco/worker',
        'typescript',
        'vscode-uri ',
      ],
    },
  },
  typescript: {
    tsConfig: {
      include: [
        '../content/**/.template/**/*.ts',
      ],
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
