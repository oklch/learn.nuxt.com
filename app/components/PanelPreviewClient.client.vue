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
</template>
