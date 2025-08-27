import extractorMdc from '@unocss/extractor-mdc'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['border-base', 'border-gray-200 dark:border-gray-800'],
    ['bg-active', 'bg-gray:10'],
    ['bg-faded', 'bg-gray:5'],
    ['bg-base', 'bg-white dark:bg-[#020420]'],
    ['text-faded', 'text-gray-600 dark:text-gray:100'],
    ['bg-code', 'bg-gray:8'],
    ['bg-inline-code', 'bg-gray-100 dark:bg-gray-800/75'],
    ['border-inline-code', 'border-gray-200 dark:border-gray-700/75'],

    ['z-embedded-docs', 'z-100'],
    ['z-embedded-docs-raised', 'z-101'],
    ['z-splitter', 'z-102'],
    ['z-embedded-docs-close', 'z-103'],
    ['z-command-palette', 'z-200'],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#00c16a',
      },
    },
  },
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: {
          name: 'DM Sans',
          weights: [200, 400, 600, 700],
        },
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  extractors: [
    extractorMdc(),
  ],
  content: {
    filesystem: [
      '../content/**/*.md',
    ],
  },
})
