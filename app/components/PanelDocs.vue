<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
}, { watch: [() => route.path] })

console.log(page.value)

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
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr_min-content]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-book-duotone />
      <NuxtLink to="/" text-sm>
        Guide
      </NuxtLink>
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
