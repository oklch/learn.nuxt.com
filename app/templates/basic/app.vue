<script setup lang="ts">
if (import.meta.client) {
  console.log('Client Init')
  onMounted(() => {
    window.addEventListener('message', (e) => {
      console.log('got message', e)
    })

    const route = useRoute()
    watch(
      () => route.fullPath,
      (newFullPath) => {
        window.parent.postMessage({
          type: 'update:path',
          path: newFullPath,
        }, '*')
      },
      { immediate: true },
    )
  })
}
</script>

<template>
  <NuxtPage />
</template>
