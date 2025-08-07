<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const route = useRoute()
const { data: home } = await useAsyncData(() => queryCollection('content').path(route.path).first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const play = usePlaygroundStore()

const ui = useUiState()
const startDragging = useThrottleFn(() => {
  ui.isPanelDragging = true
}, 1000)
function endDraggingVertical(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelDocs = e[0]!.size
}
function endDraggingHorizontal(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelEditor = e[0]!.size
  ui.panelPreview = e[1]!.size
}

// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitDocs = computed(() => isMounted.value || {
  width: `${ui.panelDocs}%`,
})
const panelInitRight = computed(() => isMounted.value || {
  width: `${100 - ui.panelDocs}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  height: `${ui.panelEditor}%`,
})
const panelInitPreview = computed(() => isMounted.value || {
  height: `${ui.panelPreview}%`,
})
const panelInitTerminal = computed(() => isMounted.value || {
  height: `${100 - ui.panelEditor - ui.panelPreview}%`,
})
</script>

<template>
  <Splitpanes h-full of-hidden @resize="startDragging" @resized="endDraggingVertical">
    <Pane :size="ui.panelDocs" :min-size="10" :style="panelInitDocs">
      <PanelDocs :home="home" />
    </Pane>
    <PaneSplitter />
    <Pane :size="100 - ui.panelDocs" :style="panelInitRight">
      <Splitpanes class="h-full of-hidden" horizontal @resize="startDragging" @resized="endDraggingHorizontal">
        <Pane :size="ui.panelEditor" min-size="10" :style="panelInitEditor">
          <PanelEditor :files="play.files" />
        </Pane>
        <PaneSplitter />
        <Pane :size="ui.panelPreview" min-size="10" :style="panelInitPreview">
          <PanelPreview />
        </Pane>
        <PaneSplitter />
        <Pane :size="100 - ui.panelEditor - ui.panelPreview" :style="panelInitTerminal">
          <PanelTerminal :stream="play.stream" />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
