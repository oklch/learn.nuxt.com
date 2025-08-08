export interface FrameFunctions {
  onColorModeChange: (colorMode: string) => void
}

export interface ParentFunctions {
  onReady: () => void
  onNavigate: (path: string) => void
}
