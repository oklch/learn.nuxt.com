<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import './styles/base.css'
import './styles/overrides.css'
import './styles/prose.css'

addCommands(
  {
    title: 'Home',
    to: '/',
    icon: 'i-ph-house-duotone',
  },
  {
    title: 'Vue Basic',
    to: '/vue/intro',
    icon: 'i-ph-file-duotone',
  },
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage page-key="playground" />
  </NuxtLayout>
</template>
