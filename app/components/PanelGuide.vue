<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

defineProps<{
  home: ContentCollectionItem | null | undefined
}>()
</script>

<template>
  <div flex="~ gap-2 items-center" border="b base dashed" bg-faded px4 py2>
    <div i-ph-book-duotone />
    <span text-sm>Guide</span>
  </div>
  <article class="p6 prose">
    <ContentRenderer v-if="home" :value="home" />
  </article>
</template>
