<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
}, { watch: [() => route.path] })

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})

if (page.value?.ogImage) {
  if (page.value.ogImage.props) {
    defineOgImageComponent('OgImageDocs', page.value.ogImage.props)
  }
  else {
    defineOgImageComponent('OgImageDocs', {
      colorMode: 'light',
    })
  }
}

const sourceUrl = computed(() =>
  page.value?.id
    ? `https://github.com/oklch/learn.nuxt.com/edit/main/content/${page.value.stem}.${page.value.extension}`
    : undefined,
)

const guide = useGuideStore()
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr_min-content]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-book-duotone />
      <span text-sm>Guide</span>
      <div flex-auto />
      <button
        v-if="guide.currentGuide?.solutions"
        text-sm my--1 mr--2 px2 py1 rounded op50
        hover="bg-active op100"
        flex="~ gap-2 items-center"
        @click="guide.toggleSolutions()"
      >
        <div v-if="!guide.showingSolution " i-ph-lightbulb-filament-duotone />
        <div v-else i-ph-arrow-counter-clockwise-duotone />
        {{ guide.showingSolution ? 'Reset challenge' : 'Show solution' }}
      </button>
    </div>
    <article class="p6 max-w-none of-auto prose">
      <ContentRenderer v-if="page" :value="page" />
    </article>
    <div border="t base dashed" px6 py2>
      <NuxtLink
        v-if="sourceUrl"
        :to="sourceUrl" target="_blank"
        flex="~ items-center gap-2" op50 hover="text-primary op100"
      >
        <div i-ph-note-pencil-duotone />
        Edit this page
      </NuxtLink>
    </div>
  </div>
</template>
