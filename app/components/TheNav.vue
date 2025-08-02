<template>
  <nav flex="~ gap-2 items-center" p="x6 y4" border="b base">
    <div i-logos-nuxt-icon text-4xl />
    <span text-2xl>learn.nuxt.com</span>
    <div flex-auto />
    <NuxtLink
      p-2 rounded hover:bg-active
      href="https://github.com/oklch/learn.nuxt.com"
      target="_blank"
    >
      <div i-logos-github-icon text-2xl />
    </NuxtLink>
  </nav>
</template>
