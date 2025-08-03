<script setup lang="ts">
const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = shallowRef<Status>('init')
const error = shallowRef<{ message: string }>()

const stream = shallowRef<ReadableStream<string>>()

async function startDevServer() {
  const wc = await useWebContainer()
  wc.on('server-ready', (port, url) => {
    status.value = 'ready'
    iframeEl.value!.src = url
  })
  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })

  const rawFiles: Record<string, string> = import.meta.glob([
    '../templates/basic/*.*',
    '!**/node_modules/**',
  ], {
    query: '?raw',
    import: 'default',
    eager: true,
  })
  const files = Object.fromEntries(
    Object.entries(rawFiles).map(([path, content]) => {
      return [path.replace('../templates/basic/', ''), {
        file: {
          contents: content,
        },
      }]
    }),
  )
  status.value = 'mount'
  await wc.mount(files)

  status.value = 'install'
  const installProcess = await wc.spawn('pnpm', ['install'])
  stream.value = installProcess.output
  const installExitCode = await installProcess.exit
  if (installExitCode !== 0) {
    status.value = 'error'
    error.value = {
      message: `Unable to run npm install, exit as ${installExitCode}`,
    }
    throw new Error('Unable to run pnpm install')
  }
  status.value = 'start'
  const devServerProcess = await wc.spawn('pnpm', ['run', 'dev'])
  stream.value = devServerProcess.output
}

onMounted(() => {
  startDevServer()
})
</script>

<template>
  <div h-full>
    <div h="67%">
      <iframe v-show="status === 'ready'" ref="iframeEl" h-full w-full />
      <div v-if="status !== 'ready'" flex="~ col items-center justify-center" text-lg h-full w-full capitalize>
        <div i-svg-spinners-90-ring-with-bg />
        {{ status }}ing...
      </div>
    </div>
    <TerminalOutput :stream="stream" h="33%" of-auto />
  </div>
</template>
