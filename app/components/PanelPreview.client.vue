<script setup lang="ts">
const iframeEl = useTemplateRef<HTMLIFrameElement>('iframeEl')

const isDragging = usePanelDragging()

const playground = useGlobalPlayground()
playground.value = createPlayground()
const { previewLocation, previewUrl, mount, status } = playground.value
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(computed(() => previewLocation.value.fullPath), inputUrl, { direction: 'ltr' })

function refreshIframe() {
  if (previewUrl.value && iframeEl.value) {
    iframeEl.value.src = previewUrl.value
    inputUrl.value = previewLocation.value.fullPath
  }
}

function navigate() {
  previewLocation.value.fullPath = inputUrl.value

  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
}

onMounted(mount)
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
          :class="{ 'pointer-events-none': !previewUrl }"
        >
          <form @submit.prevent="navigate">
            <input v-model="inputUrl" type="text" bg-transparent flex-1 focus:outline-none>
          </form>
          <div flex="~ items-center justify-end">
            <button v-if="previewUrl" mx1 op-75 hover:op-100 @click="refreshIframe">
              <div i-ph-arrow-clockwise-duotone text-sm />
            </button>
          </div>
        </div>
      </div>
    </div>
    <iframe
      v-if="previewUrl"
      ref="iframeEl"
      :src="previewUrl"
      class="bg-transparent h-full w-full"
      :class="{ 'pointer-events-none': isDragging }"
      allow="geolocation; microphone; camera; payment; autoplay; serial; cross-origin-isolated"
    />
    <div v-if="status !== 'ready'" flex="~ col items-center justify-center" text-lg h-full w-full capitalize>
      <div i-svg-spinners-90-ring-with-bg />
      {{ status }}ing...
    </div>
  </div>
</template>
