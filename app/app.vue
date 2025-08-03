<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import './styles/overrides.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  --uno: bg-base font-sans;
}

.dark {
  color-scheme: dark;
}
</style>
