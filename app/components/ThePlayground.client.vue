<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

type Status = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'
const status = shallowRef<Status>('init')
const error = shallowRef<{ message: string }>()

const isDragging = usePanelDragging()

const panelSizeEditor = usePanelCookie('nuxt-playground-panel-editor', 30)
const panelSizeFrame = usePanelCookie('nuxt-playground-panel-frame', 30)

const { iframeLocation, wcUrl } = usePlayground()
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(computed(() => iframeLocation.value.fullPath), inputUrl, { direction: 'ltr' })

const stream = shallowRef<ReadableStream<string>>()

async function startDevServer() {
  const wc = await useWebContainer()
  wc.on('server-ready', (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      status.value = 'ready'
      iframeLocation.value = {
        origin: url,
        fullPath: '/',
      }
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

const startDragging = useThrottleFn(() => {
  isDragging.value = true
}, 1000)
function endDragging(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0]!.size
  panelSizeFrame.value = e[1]!.size
}

function refreshIframe() {
  if (wcUrl.value && iframeEl.value) {
    iframeEl.value.src = wcUrl.value
    inputUrl.value = iframeLocation.value.fullPath
  }
}

function navigate() {
  iframeLocation.value.fullPath = inputUrl.value

  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
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
      <div border="b base dashed" px4 bg-faded flex>
        <div flex="~ gap-2 items-center" py2>
          <div i-ph-globe-duotone />
          <span text-sm>Preview</span>
        </div>
        <div px-2 py1.5>
          <div
            flex="~ items-center justify-center" text-sm mx-auto px2 rounded bg-faded border="base 1 hover:gray-500/30"
            :class="{ 'pointer-events-none': !wcUrl }"
          >
            <form @submit.prevent="navigate">
              <input v-model="inputUrl" type="text" bg-transparent flex-1 focus:outline-none>
            </form>
            <div flex="~ items-center justify-end">
              <button v-if="wcUrl" mx1 op-75 hover:op-100 @click="refreshIframe">
                <div i-ph-arrow-clockwise-duotone text-sm />
              </button>
            </div>
          </div>
        </div>
      </div>
      <iframe
        v-if="wcUrl"
        ref="iframeEl"
        :src="wcUrl"
        bg-transparent h-full w-full
        :class="{ 'pointer-events-none': isDragging }"
        allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
      />
      <div v-if="status !== 'ready'" flex="~ col items-center justify-center" text-lg h-full w-full capitalize>
        <div i-svg-spinners-90-ring-with-bg />
        {{ status }}ing...
      </div>
    </Pane>
    <Pane>
      <PanelTerminal :stream="stream" />
    </Pane>
  </Splitpanes>
</template>
