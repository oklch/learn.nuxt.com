<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const props = withDefaults(
  defineProps<{
    item: ContentNavigationItem
    level?: number
  }>(),
  {
    level: 0,
  },
)

const route = useRoute()
const ui = useUiStore()

const resolved = computed(() => {
  if (props.item.children?.length === 1)
    return props.item.children[0]!
  return props.item
})

const paddingLeft = computed(() => `${0.5 + props.level * 0.8}rem`)

const detailsOpen = ref(route.path.includes(resolved.value.path))
</script>

<template>
  <template v-if="resolved.children?.length">
    <div
      px1 py0.5
      flex="~ gap-1 items-center"
      hover="text-primary bg-active"
      :style="{ paddingLeft }"
      cursor-pointer select-none
      @click="detailsOpen = !detailsOpen"
    >
      <div class="caret" i-ph-caret-right-duotone text-sm op50 transition duration-400 :class="{ 'rotate-90': detailsOpen }" />
      <div i-ph-folder-simple-duotone />
      <div ml1>
        {{ resolved.title }}
      </div>
    </div>
    <div of-hidden>
      <Transition name="nav-dropdown">
        <div v-show="detailsOpen">
          <ContentNavItem
            v-for="child of resolved.children"
            :key="child.path"
            :item="child"
            :level="props.level + 1"
          />
        </div>
      </Transition>
    </div>
  </template>
  <NuxtLink
    v-else
    :to="resolved.path"
    px1 py0.5
    flex="~ gap-1 items-center"
    hover="text-primary bg-active"
    :style="{ paddingLeft }"
    :class="{ 'text-primary bg-active': resolved.path === route.path }"
    @click="ui.isContentDropdownShown = false"
  >
    <div i-ph-caret-right-duotone text-sm op0 />
    <div i-ph-file-duotone />
    <div ml1>
      {{ resolved.title }}
    </div>
  </NuxtLink>
</template>
