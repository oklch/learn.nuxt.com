<script setup lang="ts">
import type { ITheme } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import themeDark from 'theme-vitesse/extra/xterm-vitesse-dark.json'
import themeLight from 'theme-vitesse/extra/xterm-vitesse-light.json'
import '@xterm/xterm/css/xterm.css'

const { stream } = defineProps<{
  stream?: ReadableStream
}>()

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

watch(
  () => theme.value,
  (t) => {
    terminal.options.theme = t
  },
)

const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)

function read() {
  if (!stream)
    return
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

watch(() => stream, () => {
  if (stream) {
    try {
      read()
    }
    catch (e) {
      console.error('Terminal stream error:', e)
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
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-terminal-window-duotone />
      <span text-sm>Terminal</span>
    </div>
    <div ref="root" h-full w-full of-hidden />
  </div>
</template>
