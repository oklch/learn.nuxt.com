<script setup lang="ts">
const { path, isDirectory, isDirectoryOpen } = defineProps<{
  path: string
  isDirectory?: boolean
  isDirectoryOpen?: boolean
}>()

const FILE_ICONS = [
  {
    match: /\.vue$/,
    icon: 'i-catppuccin-vue',
  },
  {
    match: /nuxt\.config\.\w+$/,
    icon: 'i-catppuccin-nuxt',
  },
  {
    match: /package\.json$/,
    icon: 'i-catppuccin-npm',
  },
  {
    match: /\.[mc]?tsx?$/,
    icon: 'i-catppuccin-typescript',
  },
  {
    match: /\.[mc]?jsx?$/,
    icon: 'i-catppuccin-javascript',
  },
]

function getFileIcon(filepath: string) {
  for (const { match, icon } of FILE_ICONS) {
    if (match.test(filepath))
      return icon
  }
  return 'i-catppuccin-file'
}

const icon = computed(() => {
  if (isDirectory) {
    return isDirectoryOpen
      ? 'i-catppuccin-folder-open'
      : 'i-catppuccin-folder'
  }
  else {
    return getFileIcon(path)
  }
})
</script>

<template>
  <div :class="icon" />
</template>
