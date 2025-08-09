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
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ['border-base', 'border-gray-200 dark:border-gray-800'],
    ['bg-active', 'bg-gray:10'],
    ['bg-faded', 'bg-gray:5'],
    ['bg-base', 'bg-white dark:bg-[#020420]'],
    ['text-faded', 'text-gray-600 dark:text-gray:100'],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#00DC82',
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
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  extractors: [
    extractorMdc(),
  ],
  content: {
    filesystem: [
      './content/**/*.md',
    ],
  },
})
