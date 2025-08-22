<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

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

const runtime = useRuntimeConfig()
const sourceUrl = computed(() =>
  page.value?.id
    ? `${runtime.public.repoUrl}/edit/main/content/${page.value.stem}.${page.value.extension}`
    : undefined,
)

const ui = useUiStore()

const { data: navigation } = useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

const { data: surroundings } = useAsyncData(`${route.path}-surroundings`, () => {
  return queryCollectionItemSurroundings('content', route.path, {
    fields: ['title', 'description'],
  })
}, { watch: [() => route.path] })
const prev = computed(() => surroundings.value?.[0])
const next = computed(() => surroundings.value?.[1])

interface BreadcrumbItem {
  title: string
  path?: string
}
const contentPath = computed(() => page.value?.path)

function findNavItemFromPath(
  path: string,
  items: ContentNavigationItem[] | undefined = navigation.value,
): ContentNavigationItem | undefined {
  const item = items?.find(i => i.path === path)
  if (item)
    return item

  const parts = path.split('/').filter(Boolean)
  for (let i = parts.length - 1; i > 0; i--) {
    const parentPath = `/${parts.slice(0, i).join('/')}`
    const parent = items?.find(i => i.path === parentPath)
    if (parent)
      return findNavItemFromPath(path, parent.children || [])
  }
}

const breadcrumbs = computed(() => {
  const parts = contentPath.value?.split('/').filter(Boolean) || []
  const breadcrumbs = parts
    .map((_, idx): BreadcrumbItem => {
      const path = `/${parts.slice(0, idx + 1).join('/')}`
      const item = findNavItemFromPath(path)
      return {
        title: item?.title || 'Not found',
        path: item ? path : undefined,
      }
    })

  if (!breadcrumbs.find(i => i.path === '/')) {
    breadcrumbs.unshift({
      title: 'Guide',
      path: '/',
    })
  }
  return breadcrumbs
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded>
      <div i-ph-book-duotone />
      <template v-for="(bc, idx) in breadcrumbs" :key="bc.path">
        <div v-if="idx !== 0" i-ph-caret-right text-sm mx--1 op50 />
        <NuxtLink :to="bc.path" text-sm hover="underline underline-dashed text-primary">
          {{ bc.title }}
        </NuxtLink>
      </template>
      <button
        flex-auto h-full
        @click="ui.isContentDropdownShown = !ui.isContentDropdownShown"
      />
      <button
        i-ph-caret-down-duotone text-sm ml-auto op50 transition duration-400
        :class="ui.isContentDropdownShown ? 'rotate-180' : ''"
        @click="ui.isContentDropdownShown = !ui.isContentDropdownShown"
      />
    </div>
    <div h-full relative of-hidden>
      <article class="p6 h-full max-w-none of-auto prose">
        <ContentRenderer v-if="page" :value="page" />
        <div mt8 py2 grid="~ cols-[1fr_1fr] gap-4">
          <div>
            <ContentNavCard
              v-if="prev"
              :to="prev.path"
              :title="prev.title"
              :description="prev.description as string"
              subheader="Previous section"
              icon="i-ph-arrow-left"
            />
          </div>
          <div>
            <ContentNavCard
              v-if="next"
              :to="next.path"
              :title="next.title"
              :description="next.description as string"
              subheader="Next section"
              icon="i-ph-arrow-right"
              text-right items-end
            />
          </div>
        </div>
        <div border="t base dashed" mt-8 p3>
          <NuxtLink
            v-if="sourceUrl"
            :to="sourceUrl" target="_blank"
            flex="~ items-center gap-2"
            text-inherit op75
            hover="text-primary op100"
          >
            <div i-ph-note-pencil-duotone />
            Edit this page
          </NuxtLink>
        </div>
      </article>
      <!-- Navigation Dropdown -->
      <Transition name="nav-dropdown">
        <div
          v-if="ui.isContentDropdownShown"
          flex="~ col"
          border="b base"
          py2 bg-base bg-opacity-80 max-h-60vh
          left-0 right-0 top-0 absolute
          backdrop-blur-10
        >
          <ContentNavItem v-for="item in navigation" :key="item.path" :item="item" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.nav-dropdown-enter-active {
  transition: all 0.1s ease-out;
}

.nav-dropdown-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.nav-dropdown-enter-from,
.nav-dropdown-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
