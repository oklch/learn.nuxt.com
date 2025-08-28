export interface GuideMeta {
  features?: PlaygroundFeatures
  startingFile?: string
  startingUrl?: string
  files?: Record<string, string>
  solutions?: Record<string, string>
}

export interface PlaygroundFeatures {
  terminal?: boolean
  fileTree?: boolean
  download?: boolean
  navigation?: boolean
}

export type ContentLocale = 'en' | 'zh'
