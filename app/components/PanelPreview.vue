<script setup lang="ts">
const inner = useTemplateRef<{ iframe?: Ref<HTMLIFrameElement | undefined> }>('inner')

const play = usePlaygroundStore()
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(computed(() => play.previewLocation.fullPath), inputUrl, { direction: 'ltr' })

function refreshIframe() {
  if (play.previewUrl && inner.value?.iframe?.value) {
    inner.value.iframe.value.src = play.previewUrl
    play.updatePreviewUrl()
    inputUrl.value = play.previewLocation.fullPath
  }
}

function navigate() {
  play.previewLocation.fullPath = inputUrl.value
  play.updatePreviewUrl()
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
}
</script>

<template>
  <div class="h-full w-full of-hidden" :class="play.status === 'ready' ? ' grid grid-rows-[min-content_1fr]' : 'flex'">
    <div
      v-if="play.status === 'ready'"
      border="b base dashed" px4 bg-faded
      flex="~ items-center gap-2"
    >
      <div flex="~ gap-2 items-center" py2>
        <div i-ph-globe-duotone />
        <span text-sm>Preview</span>
      </div>
      <div px-2 py1>
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
    <!-- absolute because when previewUrl is not null, PanelPreviewLoading and PanelPreviewClient will both appear -->
    <div h-full w-full relative>
      <PanelPreviewLoading />
      <PanelPreviewClient ref="inner" />
    </div>
  </div>
</template>
