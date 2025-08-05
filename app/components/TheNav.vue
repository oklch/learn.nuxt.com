<template>
  <nav flex="~ gap-1 items-center" p="x4 y3" border="b base">
    <NuxtLink to="/" title="Nuxt Playground">
      <NuxtPlaygroundLogo class="h-2em" />
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
