<script setup lang="ts">
const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

const ui = useUiState()
const play = usePlaygroundStore()
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(computed(() => play.previewLocation.fullPath), inputUrl, { direction: 'ltr' })

function refreshIframe() {
  if (play.previewUrl && iframeEl.value) {
    iframeEl.value.src = play.previewUrl
    inputUrl.value = play.previewLocation.fullPath
  }
}

function navigate() {
  play.previewLocation.fullPath = inputUrl.value

  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
}

onMounted(() => mountPlayground(play))
</script>

<template>
  <div class="h-full w-full of-hidden" grid="~ rows-[min-content_1fr]">
    <div border="b base dashed" px4 bg-faded flex>
      <div flex="~ gap-2 items-center" py2>
        <div i-ph-globe-duotone />
        <span text-sm>Preview</span>
      </div>
      <div px-2 py1.5>
        <div
          flex="~ items-center justify-center" text-sm mx-auto px2 rounded bg-faded border="base 1 hover:gray-500/30"
          :class="{ 'pointer-events-none': !play.previewUrl }"
        >
          <form @submit.prevent="navigate">
            <input v-model="inputUrl" type="text" bg-transparent flex-1 focus:outline-none>
          </form>
          <div flex="~ items-center justify-end">
            <button v-if="play.previewUrl" mx1 op-75 hover:op-100 @click="refreshIframe">
              <div i-ph-arrow-clockwise-duotone text-sm />
            </button>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>
