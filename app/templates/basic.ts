import { VirtualFile } from '~/structures/VirtualFile'
import { filesToWebContainerFs } from './utils'

export default function load() {
  const rawFiles: Record<string, string> = import.meta.glob([
    './basic/**/*.*',
    './basic/**/.npmrc',
  ], {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const files = Object.entries(rawFiles)
    .map(([path, content]) => {
      return new VirtualFile(path.replace('./basic/', ''), content)
    })
  const tree = filesToWebContainerFs(files)

  return {
    files,
    tree,
  }
}
