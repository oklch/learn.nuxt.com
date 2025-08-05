<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const route = useRoute()
const { data: home } = await useAsyncData(() => queryCollection('content').path(route.path).first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const leftSize = usePanelCookie('nuxt-playground-panel-left', 30)
const isDragging = usePanelDragging()
const startDragging = useThrottleFn(() => {
  isDragging.value = true
}, 1000)
function endDragging(e: { size: number }[]) {
  leftSize.value = e[0]!.size
  isDragging.value = false
}
</script>

<template>
  <Splitpanes @resize="startDragging" @resized="endDragging">
    <Pane :size="leftSize" :min-size="10">
      <PanelGuide :home="home" />
    </Pane>
    <Pane :size="100 - leftSize">
      <ThePlayground />
    </Pane>
  </Splitpanes>
</template>
