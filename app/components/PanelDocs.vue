<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
}, { watch: [() => route.path] })

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-book-duotone />
      <span text-sm>Guide</span>
    </div>
    <article class="p6 max-w-none of-auto prose">
      <ContentRenderer v-if="page" :value="page" />
    </article>
  </div>
</template>
