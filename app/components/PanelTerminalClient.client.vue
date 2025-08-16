<script setup lang="ts">
import type { ITheme } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import themeDark from 'theme-vitesse/extra/xterm-vitesse-dark.json'
import themeLight from 'theme-vitesse/extra/xterm-vitesse-light.json'
import '@xterm/xterm/css/xterm.css'

const play = usePlaygroundStore()

const colorMode = useColorMode()
const theme = computed<ITheme>(() => {
  return colorMode.value === 'dark'
    ? {
        ...themeDark,
        background: '#00000000',
      }
    : {
        ...themeLight,
        background: '#00000000',
      }
})

const root = useTemplateRef<HTMLDivElement>('root')
const terminal = new Terminal({
  allowTransparency: true,
  theme: theme.value,
  fontFamily: 'DM Mono, monospace',
})

// persist the scroll position of terminal
const ui = useUiState()
watch(() => ui.showTerminal, (v) => {
  if (!root.value)
    return
  if (!v) {
    const { height } = root.value.getBoundingClientRect()
    root.value.style.height = `${height}px`
  }
  else {
    root.value.style.height = 'initial'
  }
}, { flush: 'sync' })

watch(
  () => theme.value,
  (t) => {
    terminal.options.theme = t
  },
)

const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)

function read(stream: ReadableStream<string>) {
  const reader = stream.getReader()

  function readNext() {
    reader.read().then(({ done, value }) => {
      if (done)
        return
      terminal.write(value)
      readNext()
    })
  }
  readNext()
}

let init = false

watch(() => play.currentProcess, (p) => {
  if (p) {
    if (!init) {
      init = true
    }
    else {
      terminal.writeln('')
      terminal.writeln(`-------------`)
      terminal.writeln('')
    }
    try {
      read(p.output)
    }
    catch (e) {
      console.error('Terminal read stream error:', e)
    }
    try {
      const writer = p.input.getWriter()
      terminal.onData((data) => {
        writer.write(data)
      })
    }
    catch (e) {
      console.error('Terminal write stream error:', e)
    }
  }
}, { flush: 'sync', immediate: true })

useResizeObserver(root, useDebounceFn(() => fitAddon.fit(), 200))

// not use mount because hydration issue, root is null when mounted
const stop = watch(root, () => {
  if (root.value) {
    terminal.open(root.value)
    terminal.write('\n')
    fitAddon.fit()
    stop()
  }
})
</script>

<template>
  <div ref="root" h-full w-full of-hidden />
</template>
