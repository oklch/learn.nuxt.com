declare module 'splitpanes' {
  import type { Component } from 'vue'

  export interface SplitpanesProps {
    horizontal: boolean
    pushOtherPanes: boolean
    dblClickSplitter: boolean
    firstSplitter: boolean
  }

  export interface PaneProps {
    size: number | string
    minSize: number | string
    maxSize: number | string
  }

  export const Pane: Component<PaneProps>
  export const Splitpanes: Component<SplitpanesProps>
}
