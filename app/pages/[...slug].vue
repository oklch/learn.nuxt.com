<script setup lang="ts">
const route = useRoute()
const { data: home } = await useAsyncData(() => queryCollection('content').path(route.path).first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})
</script>

<template>
  <div grid="~ cols-[1fr_2fr]" flex-grow>
    <article class="p4 border-r border-base prose">
      <ContentRenderer v-if="home" :value="home" />
    </article>
    <ThePlayground />
  </div>
</template>
