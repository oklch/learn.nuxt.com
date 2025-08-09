<script setup lang="ts">
const ui = useUiState()
const play = usePlaygroundStore()
</script>

<template>
  <nav flex="~ gap-1 items-center" p="x4 y3" border="b base">
    <NuxtLink to="/" title="Nuxt Playground">
      <NuxtPlaygroundLogo class="h-2em" />
    </NuxtLink>
    <div flex-auto />
    <button
      v-if="play.status === 'ready'"
      p2 rounded
      hover="bg-active"
      title="Download as ZIP"
      @click="play.actions.downloadZip()"
    >
      <div i-ph-download-duotone text-2xl />
    </button>
    <button
      p2 rounded
      title="Toggle terminal"
      hover="bg-active"
      :class="ui.showTerminal ? '' : 'op50'"
      @click="ui.toggleTerminal()"
    >
      <div i-ph-terminal-window-duotone text-2xl />
    </button>
    <ColorSchemeToggle />
    <NuxtLink
      p-2 rounded hover:bg-active
      title="GitHub"
      href="https://github.com/oklch/learn.nuxt.com"
      target="_blank"
    >
      <div i-carbon-logo-github text-2xl />
    </NuxtLink>
  </nav>
</template>
