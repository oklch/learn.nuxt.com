const INGORE_FILES: (string | RegExp)[] = [
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'node_modules', // download zip needs it
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
