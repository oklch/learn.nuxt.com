<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = shallowRef<Status>('init')
const error = shallowRef<{ message: string }>()

const isDragging = usePanelDragging()

const panelSizeEditor = usePanelCookie('nuxt-playground-panel-editor', 30)
const panelSizeFrame = usePanelCookie('nuxt-playground-panel-frame', 30)

const stream = shallowRef<ReadableStream<string>>()

async function startDevServer() {
  const wc = await useWebContainer()
  wc.on('server-ready', (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      status.value = 'ready'
      iframeEl.value!.src = url
    }
  })
  wc.on('error', (err) => {
    status.value = 'error'
    error.value = err
  })

  const tree = globFilesToWebContainerFs('../templates/basic/', import.meta.glob([
    '../templates/basic/**/*.*',
    '../templates/basic/**/.npmrc',
  ], {
    query: '?raw',
    import: 'default',
    eager: true,
  }))

  status.value = 'mount'
  await wc.mount(tree)

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

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      devServerProcess.kill()
    })
  }
}

function startDragging() {
  isDragging.value = true
}
function endDragging(e: { panes: { size: number }[] }) {
  isDragging.value = false
  panelSizeEditor.value = e.panes[0]!.size
  panelSizeFrame.value = e.panes[1]!.size
}

onMounted(() => {
  startDevServer()
})
</script>

<template>
  <Splitpanes class="h-full" horizontal @resize="startDragging" @resized="endDragging">
    <Pane :size="panelSizeEditor" min-size="10">
      <PanelEditor />
    </Pane>
    <Pane :size="panelSizeFrame" min-size="10">
      <div flex="~ gap-2 items-center" border="b base dashed" bg-faded px4 py2>
        <div i-ph-globe-duotone />
        <span text-sm>Preview</span>
      </div>
      <iframe
        v-show="status === 'ready'" ref="iframeEl" bg-transparent h-full w-full
        :class="{
          'pointer-events-none': isDragging,
        }"
        allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
      />
      <div v-if="status !== 'ready'" flex="~ col items-center justify-center" text-lg h-full w-full capitalize>
        <div i-svg-spinners-90-ring-with-bg />
        {{ status }}ing...
      </div>
    </Pane>
    <Pane>
      <PanelTerminal :stream="stream" of-auto />
    </Pane>
  </Splitpanes>
</template>
