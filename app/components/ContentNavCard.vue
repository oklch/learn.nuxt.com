<script setup lang="ts">
defineProps<{
  to?: string
  icon?: string
  title?: string
  subheader: string
  description?: string
}>()
</script>

<template>
  <div
    flex="~ col"
    class="p4 flex-1"
    border="~ base rounded-lg hover:primary"
    h-full relative
  >
    <div class="text-lg text-primary mb-3 h-7 w-7 pointer-events-none" :class="icon" />
    <div class="text-lg font-semibold my-0">
      {{ title }}
    </div>
    <div v-if="description" class="text-[14px] mb-0 mt-1 op50 line-clamp-2">
      {{ description }}
    </div>
    <NuxtLink :to="to" class="inset-0 absolute" />
  </div>
</template>
