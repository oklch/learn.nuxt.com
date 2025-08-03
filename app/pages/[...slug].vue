<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const route = useRoute()
const { data: home } = await useAsyncData(() => queryCollection('content').path(route.path).first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const leftSize = useLocalStorage('nuxt-playground-panel-left', 30)
const isDragging = usePanelDragging()
function startDragging() {
  isDragging.value = true
}
function endDragging(e: { panes: { size: number }[] }) {
  leftSize.value = e.panes[0]!.size
  isDragging.value = false
}
</script>

<template>
  <Splitpanes class="flex-grow" @resize="startDragging" @resized="endDragging">
    <Pane :size="leftSize" :min-size="10">
      <article class="p4 prose">
        <ContentRenderer v-if="home" :value="home" />
      </article>
    </Pane>
    <Pane>
      <ThePlayground />
    </Pane>
  </Splitpanes>
</template>
