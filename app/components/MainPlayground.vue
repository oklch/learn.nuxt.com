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
</script>

<template>
  <Splitpanes @resize="startDragging" @resized="endDraggingVertical">
    <Pane :size="ui.panelDocs" :min-size="10">
      <PanelDocs :home="home" />
    </Pane>
    <Pane :size="100 - ui.panelDocs">
      <Splitpanes class="h-full of-hidden" horizontal @resize="startDragging" @resized="endDraggingHorizontal">
        <Pane :size="ui.panelEditor" min-size="10">
          <PanelEditor :files="play.files" />
        </Pane>
        <Pane :size="ui.panelPreview" min-size="10">
          <PanelPreview />
        </Pane>
        <Pane :size="100 - ui.panelEditor - ui.panelPreview">
          <PanelTerminal :stream="play.stream" />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
