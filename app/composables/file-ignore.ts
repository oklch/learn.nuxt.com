const INGORE_FILES: (string | RegExp)[] = [
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  /tsconfig\.json$/, // tsconfig.json and server/tsconfig.json
  /^\./,
  /layer-playground\/.*/,
]

export function isFileIgnored(filepath: string) {
  return INGORE_FILES.some(pattern => typeof pattern === 'string'
    ? filepath === pattern
    : pattern.test(filepath),
  )
}
