<script setup lang="ts">
defineProps<{
  to: string
  icon?: string
  title: string
  description: string
  wip?: boolean
}>()
</script>

<template>
  <div
    class="px-4 pb-4 pt-5 flex-1"
    border="~ base rounded-lg hover:primary"
    min-w-80 relative
    :class="wip ? 'op75 pointer-events-none' : ''"
  >
    <span class="text-lg text-primary mb-3 inline-flex h-7 w-7 pointer-events-none" :class="icon" />
    <div class="text-lg font-semibold my-0">
      {{ title }}
      <sup v-if="wip" text-sm text-primary font-normal px1 rounded bg-primary:10>
        {{ $t('coming-soon') }}
      </sup>
    </div>
    <div class="text-[15px] mb-0 mt-1 op50">
      {{ description }}
      <slot />
    </div>
    <NuxtLink :to="to" class="inset-0 absolute" />
  </div>
</template>
