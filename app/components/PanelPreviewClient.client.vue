<script setup lang="ts">
const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

const ui = useUiState()
const play = usePlaygroundStore()
const colorMode = useColorMode()

function onIframeLoad() {
  syncColorMode()
}

function syncColorMode() {
  iframeEl.value?.contentWindow?.postMessage({
    type: 'color-mode',
    mode: colorMode.value,
  }, '*')
}

watch(
  () => colorMode.value,
  syncColorMode,
  { flush: 'sync' },
)

onMounted(() => mountPlayground(play, colorMode.value))
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
    @load="onIframeLoad"
  />
</template>
