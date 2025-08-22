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

const ui = useUiStore()

const { data: navigation } = useAsyncData(`navigation`, () => {
  return queryCollectionNavigation('content')
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr_min-content]">
    <button
      flex="~ gap-2 items-center" border="b base dashed" px4 py2 bg-faded
      @click="ui.isContentDropdownShown = !ui.isContentDropdownShown"
    >
      <div i-ph-book-duotone />
      <NuxtLink to="/" text-sm>
        Guide
      </NuxtLink>
      <div flex-auto />
      <div i-ph-caret-down-duotone text-sm op50 transition duration-400 :class="ui.isContentDropdownShown ? 'rotate-180' : ''" />
    </button>
    <div h-full relative of-hidden>
      <article class="p6 h-full max-w-none of-auto prose">
        <ContentRenderer v-if="page" :value="page" />
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
