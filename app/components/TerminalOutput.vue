<script setup lang="ts">
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const { stream } = defineProps<{
  stream?: ReadableStream<string>
}>()

const root = useTemplateRef<HTMLDivElement>('root')
const terminal = new Terminal()

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

onMounted(() => {
  terminal.open(root.value!)
})
</script>

<template>
  <div ref="root" />
</template>
