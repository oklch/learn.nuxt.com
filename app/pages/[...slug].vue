<script setup lang="ts">
const router = useRouter()
const guide = useGuideStore()

const templatesMap = Object.fromEntries(
  Object.entries(import.meta.glob(['../../content/**/.template/index.ts', '../../content/.template/index.ts']))
    .map(([key, loader]) => [
      key
        .replace('../../content', '')
        .replace(/\/\.template\/index\.ts$/, '')
        .replace(/\/\d+\./g, '/'),
      loader,
    ]),
)

if (import.meta.dev)
  // eslint-disable-next-line no-console
  console.log('templates', Object.keys(templatesMap))

async function mount(path: string) {
  path = path.replace(/\/$/, '') // remove trailing slash
  await guide.mount(
    await templatesMap[path]?.().then((m: any) => m.meta),
    false,
  )
}

router.afterEach(async (to) => {
  mount(to.path)
})

onMounted(() => {
  mount(router.currentRoute.value.path)
})
</script>

<template>
  <div>
    <MainPlayground />
    <CommandPalette />
  </div>
</template>
