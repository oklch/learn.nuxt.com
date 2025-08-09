import type { TemplateOptions } from './types'
import { VirtualFile } from '~/structures/VirtualFile'
import { filesToWebContainerFs } from './utils'

export default function load(options: TemplateOptions = {}) {
  const rawInput: Record<string, string> = import.meta.glob([
    './basic/**/*.*',
    './basic/**/layer-playground/**/*.*',
    './basic/**/.nuxtrc',
    './basic/**/.npmrc',
  ], {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const rawFiles = {
    ...Object.fromEntries(
      Object.entries(rawInput)
        .map(([key, value]) => [key.replace('./basic/', ''), value]),
    ),
    ...options.files,
  }

  // Merge .nuxtrc
  if (options.nuxtrc) {
    rawFiles['.nuxtrc'] = [
      rawFiles['.nuxtrc'] || '',
      ...options.nuxtrc,
    ].join('\n')
  }

  const files = Object.entries(rawFiles)
    .map(([path, content]) => {
      return new VirtualFile(path, content)
    })
  const tree = filesToWebContainerFs(files)

  return {
    files,
    tree,
  }
}
