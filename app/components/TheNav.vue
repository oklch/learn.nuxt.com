<template>
  <nav flex="~ gap-2 items-center" p="x6 y3" border="b base">
    <NuxtLink to="/" flex="~ gap-2 items-center" title="Nuxt Playground">
      <NuxtLogo class="mt--1.8 h-1.3em" />
      <span text-xl>Playground</span>
    </NuxtLink>
    <div flex-auto />
    <ColorSchemeToggle />
    <NuxtLink
      p-2 rounded hover:bg-active
      href="https://github.com/oklch/learn.nuxt.com"
      target="_blank"
    >
      <div i-carbon-logo-github text-2xl />
    </NuxtLink>
  </nav>
</template>
