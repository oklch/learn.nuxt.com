import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asOgImageCollection } from 'nuxt-og-image/content'

export default defineContentConfig({
  collections: {
    en: defineCollection(asOgImageCollection({
      type: 'page',
      source: {
        include: 'en/**',
        exclude: ['**/.template/**'],
      },
    })),
    zh: defineCollection(asOgImageCollection({
      type: 'page',
      source: {
        include: 'zh/**',
        exclude: ['**/.template/**'],
      },
    })),
  },
})
