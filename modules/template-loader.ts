import fs from 'node:fs/promises'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { addTemplate, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'template-loader',
  },
  setup() {
    addTemplate({
      filename: 'templates/basic.ts',
      getContents: async () => {
        const dir = fileURLToPath(new URL('../app/templates/basic', import.meta.url))
        const files = await fg('**/*.*', {
          ignore: [
            '**/node_modules/**',
            '**/.git/**',
            '**/.nuxt/**',
          ],
          dot: true,
          cwd: dir,
          onlyFiles: true,
          absolute: true,
        })
        const filesMap: Record<string, string> = {}

        await Promise.all(
          files.map(async (filename) => {
            const content = await fs.readFile(filename, 'utf-8')
            filesMap[relative(dir, filename)] = content
          }),
        )
        return `export default ${JSON.stringify(filesMap)}`
      },
    })
  },
})
