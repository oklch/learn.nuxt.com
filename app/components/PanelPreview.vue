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
  <div h-full :class="play.status === 'ready' ? ' grid grid-rows-[min-content_1fr]' : 'flex'">
    <div
      v-if="play.status === 'ready'"
      flex="~ items-center gap-2"
      border="b base dashed" pl1 pr2 bg-faded
    >
      <div
        v-if="guide.features.navigation"
        flex="~ auto gap-2 items-center"
        border="~ base"
        tracking-wide m1.5 px2 py0.5 rounded bg-faded
      >
        <div i-ph-globe-duotone />
        <span text-sm op50>{{ $t('preview') }}</span>
        <div
          text-sm
          flex="~ items-center justify-center auto"
          :class="{
            'pointer-events-none': !preview.url,
          }"
        >
          <form w-full @submit.prevent="navigate">
            <input
              v-model="inputUrl" type="text"
              bg-transparent flex-1 w-full focus:outline-none
            >
          </form>
        </div>
      </div>
      <div
        v-else
        flex="~ gap-2 auto items-center" px2 py2
      >
        <div i-ph-globe-duotone />
        <span text-sm>{{ $t('preview') }}</span>
      </div>
      <button
        p1 rounded
        hover="bg-active"
        :title="$t('refresh-preview')"
        @click="refreshIframe"
      >
        <div i-ph-arrow-clockwise-duotone text-lg />
      </button>
      <VDropdown :distance="6">
        <button
          p1 rounded
          hover="bg-active"
          :title="$t('playground-information')"
        >
          <div i-ph-info-duotone text-lg />
        </button>
        <template #popper>
          <div px5 py4 grid="~ gap-y-3 gap-x-2 cols-[max-content_1fr] items-center">
            <div i-catppuccin-vue text-xl />
            <div flex="~ gap-2 items-center">
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
              {{ $t('vue-version') }}:
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
              <code>
                v{{ preview.clientInfo!.versionVue }}
              </code>
            </div>
            <div i-catppuccin-nuxt text-xl />
            <div flex="~ gap-2 items-center">
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
              {{ $t('nuxt-version') }}:
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
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
