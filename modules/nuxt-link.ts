import { fileURLToPath } from 'node:url'
import { defineNuxtModule } from 'nuxt/kit'

/**
 * build time, not runtime (plugin)
 * useNuxtApp().vueApp._context.components -> global components (RouterLink, VDropdown)
 * NuxtLink -> auto import (see addComponent: global: opts.global ?? false,)
 */
export default defineNuxtModule({
  meta: {
    name: 'custom-nuxt-link',
  },
  setup(_, nuxt) {
    nuxt.hook('components:extend', (components) => {
      const NuxtLink = components.find(c => c.pascalName === 'NuxtLink')!
      const path = fileURLToPath(new URL('../app/components/CustomNuxtLink.ts', import.meta.url))
      NuxtLink.shortPath = path
      NuxtLink.filePath = path
    })
  },
})
