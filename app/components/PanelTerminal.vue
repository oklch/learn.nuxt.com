<script setup lang="ts">
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const { stream } = defineProps<{
  stream?: ReadableStream<string>
}>()

const root = useTemplateRef<HTMLDivElement>('root')
const terminal = new Terminal()
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

watch(() => stream, (newStream) => {
  if (newStream) {
    read()
  }
}, { flush: 'sync', immediate: true })

useResizeObserver(root, useDebounceFn(() => fitAddon.fit(), 200))

onMounted(() => {
  terminal.open(root.value!)
  terminal.write('\n')
  fitAddon.fit()
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
