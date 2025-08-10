<script setup lang="ts">
import type { FrameFunctions, ParentFunctions } from '~/types/rpc'
import { createBirpc } from 'birpc'

const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

const ui = useUiState()
const play = usePlaygroundStore()
const colorMode = useColorMode()

const parentFunctions: ParentFunctions = {
  // We wait for the client to send the ready message
  // So we don't show the loading screen
  onReady: () => {
    play.status = 'ready'
    syncColorMode()
  },
  onNavigate: (path: string) => {
    // previewUrl is not computed, no need to refresh again
    play.previewLocation.fullPath = path
  },
}

const rpc = createBirpc<FrameFunctions, ParentFunctions>(parentFunctions, {
  post: (payload) => {
    iframeEl.value?.contentWindow?.postMessage({
      source: 'nuxt-playground-parent',
      payload,
    }, '*')
  },
  on: (fn) => {
    window.addEventListener('message', (event) => {
      if (event.data.source !== 'nuxt-playground-frame')
        return
      fn(event.data.payload)
    })
  },
})

function syncColorMode() {
  rpc.onColorModeChange(colorMode.value)
}

watch(
  () => colorMode.value,
  syncColorMode,
  { flush: 'sync' },
)
</script>

<template>
  <iframe
    v-if="play.previewUrl"
    ref="iframeEl"
    :src="play.previewUrl"
    class="bg-transparent h-full w-full inset-0 absolute"
    :style="play.status === 'ready' ? '' : 'visibility: hidden;'"
    :class="{ 'pointer-events-none': ui.isPanelDragging }"
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
</template>
