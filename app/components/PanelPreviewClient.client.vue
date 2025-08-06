<script setup lang="ts">
const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

const ui = useUiState()
const play = usePlaygroundStore()

onMounted(() => mountPlayground(play))
</script>

<template>
  <iframe
    v-if="play.previewUrl"
    ref="iframeEl"
    :src="play.previewUrl"
    class="bg-transparent h-full w-full"
    :class="{ 'pointer-events-none': ui.isPanelDragging }"
    allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
  />
  <div v-if="play.status !== 'ready'" flex="~ col items-center justify-center" text-lg h-full w-full capitalize>
    <div i-svg-spinners-90-ring-with-bg />
    {{ play.status }}ing...
  </div>
</template>
