<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const route = useRoute()
const { data: home } = await useAsyncData(() => queryCollection('content').path(route.path).first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const playground = useGlobalPlayground()

const isDragging = usePanelDragging()
const panelSizeDocs = usePanelCookie('nuxt-playground-panel-docs', 30)
const panelSizeEditor = usePanelCookie('nuxt-playground-panel-editor', 30)
const panelSizePreview = usePanelCookie('nuxt-playground-panel-preview', 30)

const startDragging = useThrottleFn(() => {
  isDragging.value = true
}, 1000)
function endDraggingVertical(e: { size: number }[]) {
  isDragging.value = false
  panelSizeDocs.value = e[0]!.size
}
function endDraggingHorizontal(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0]!.size
  panelSizePreview.value = e[1]!.size
}
</script>

<template>
  <Splitpanes @resize="startDragging" @resized="endDraggingVertical">
    <Pane :size="panelSizeDocs" :min-size="10">
      <PanelDocs :home="home" />
    </Pane>
    <Pane :size="100 - panelSizeDocs">
      <Splitpanes class="h-full of-hidden" horizontal @resize="startDragging" @resized="endDraggingHorizontal">
        <Pane :size="panelSizeEditor" min-size="10">
          <PanelEditor :files="playground?.files" />
        </Pane>
        <Pane :size="panelSizePreview" min-size="10">
          <PanelPreview />
        </Pane>
        <Pane :size="100 - panelSizeEditor - panelSizePreview">
          <PanelTerminal :stream="playground?.stream?.value" />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
