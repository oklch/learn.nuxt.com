import type { FileSystemTree } from '@webcontainer/api'
import { WebContainer } from '@webcontainer/api'

let _webcontainerPromise: Promise<WebContainer>

export async function useWebContainer() {
  if (!_webcontainerPromise) {
    _webcontainerPromise = WebContainer.boot()
  }
  return await _webcontainerPromise
}

export function globFilesToWebContainerFs(prefix: string, rawFiles: Record<string, string>) {
  const files = Object.fromEntries(
    Object.entries(rawFiles).map(([path, content]) => {
      return [path.replace(prefix, ''), {
        file: {
          contents: content,
        },
      }]
    }),
  )

  const tree: FileSystemTree = {}

  for (const [path, file] of Object.entries(files)) {
    if (!path.includes('/')) {
      tree[path] = file
      continue
    }
    const parts = path.split('/')
    const filename = parts.pop()!
    let current = tree
    for (const dir of parts) {
      if (!current[dir]) {
        current[dir] = { directory: {} }
      }
      if (!('directory' in current[dir])) {
        throw new Error('Unexpected directory but found file')
      }
      current = current[dir].directory
    }
    current[filename] = file
  }
  return tree
}
