export interface GuideMeta {
  features?: PlaygroundFeatures
  startingFile?: string
  startingUrl?: string
  // TODO:
  packageJsonOverrides?: any
  files?: Record<string, string>
  solutions?: Record<string, string>
}

export interface PlaygroundFeatures {
  terminal?: boolean
  fileTree?: boolean
  download?: boolean
}
