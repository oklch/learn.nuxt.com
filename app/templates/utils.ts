import type { FileSystemTree } from '@webcontainer/api'
import type { VirtualFile, VirtualFileSystemTree } from '~/structures'

export function filesToWebContainerFs(files: VirtualFile[]) {
  const tree: FileSystemTree = {}

  for (const file of files) {
    const path = file.filepath
    if (!path.includes('/')) {
      tree[path] = file.toFileNode()
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
    current[filename] = file.toFileNode()
  }
  return tree
}

export function filesToVirtualFsTree(files: VirtualFile[]) {
  const tree: VirtualFileSystemTree = {}

  for (const file of files) {
    const path = file.filepath
    if (!path.includes('/')) {
      tree[path] = { file }
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
    current[filename] = { file }
  }
  return tree
}
