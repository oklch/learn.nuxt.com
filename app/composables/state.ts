export function usePanelDragging() {
  return useState('is-panel-dragging', () => false)
}

export function useGlobalPlayground() {
  return useState<PlaygroundInstance | undefined>('playground', () => undefined)
}

export function usePanelCookie(name: string, value: number) {
  return useCookie(
    name,
    { default: () => (value), watch: true },
  )
}
