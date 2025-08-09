<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

defineProps<{
  home: ContentCollectionItem | null | undefined
}>()
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-book-duotone />
      <span text-sm>Guide</span>
    </div>
    <article class="p6 max-w-none of-auto prose">
      <ContentRenderer v-if="home" :value="home" />
    </article>
  </div>
</template>
