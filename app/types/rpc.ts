export interface FrameFunctions {
  onColorModeChange: (colorMode: string) => void
}

export interface ParentFunctions {
  onReady: (info: ClientInfo) => void
  onNavigate: (path: string) => void
}

export interface ClientInfo {
  versionNuxt: string
  versionVue: string
}
