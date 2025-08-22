<script setup lang="ts">
const inner = useTemplateRef<{ iframe?: Ref<HTMLIFrameElement | undefined> }>('inner')

const play = usePlaygroundStore()
const preview = usePreviewStore()
// auto update inputUrl when location value changed
const inputUrl = ref<string>('')
syncRef(computed(() => preview.location.fullPath), inputUrl, { direction: 'ltr' })

const guide = useGuideStore()

function refreshIframe() {
  if (preview.url && inner.value?.iframe?.value) {
    inner.value.iframe.value.src = preview.url
    preview.updateUrl()
    inputUrl.value = preview.location.fullPath
  }
}

function navigate() {
  preview.location.fullPath = inputUrl.value
  preview.updateUrl()
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement)
    activeElement.blur()
}
</script>

<template>
  <div class="h-full w-full of-hidden" :class="play.status === 'ready' ? ' grid grid-rows-[min-content_1fr]' : 'flex'">
    <div
      v-if="play.status === 'ready'"
      border="b base dashed" pl4 pr2 bg-faded
      flex="~ items-center gap-2"
    >
      <div flex="~ gap-2 items-center" py2>
        <div i-ph-globe-duotone />
        <span text-sm>Preview</span>
      </div>
      <div v-if="guide.features.navigation" px-2 py1>
        <div
          flex="~ items-center justify-center" text-sm mx-auto px2 rounded bg-faded border="base 1 hover:gray-500/30"
          :class="{ 'pointer-events-none': !preview.url }"
        >
          <form @submit.prevent="navigate">
            <input v-model="inputUrl" type="text" bg-transparent flex-1 focus:outline-none>
          </form>
          <div flex="~ items-center justify-end">
            <button v-if="preview.url" mx1 op-75 hover:op-100 @click="refreshIframe">
              <div i-ph-arrow-clockwise-duotone text-sm />
            </button>
          </div>
        </div>
      </div>
      <div flex-auto />
      <VDropdown :distance="6">
        <button
          p1 rounded
          hover="bg-active"
          title="Playground Information"
        >
          <div i-ph-info-duotone text-lg />
        </button>
        <template #popper>
          <div px5 py4 grid="~ gap-y-3 gap-x-2 cols-[max-content_1fr] items-center">
            <div i-catppuccin-vue text-xl />
            <div flex="~ gap-2 items-center">
              Vue version:
              <code>
                v{{ preview.clientInfo!.versionVue }}
              </code>
            </div>
            <div i-catppuccin-nuxt text-xl />
            <div flex="~ gap-2 items-center">
              Nuxt version:
              <code>
                v{{ preview.clientInfo!.versionNuxt }}
              </code>
            </div>
          </div>
        </template>
      </VDropdown>
    </div>
    <!-- absolute because when previewUrl is not null, PanelPreviewLoading and PanelPreviewClient will both appear -->
    <div h-full w-full relative>
      <PanelPreviewLoading />
      <PanelPreviewClient ref="inner" />
    </div>
  </div>
</template>
