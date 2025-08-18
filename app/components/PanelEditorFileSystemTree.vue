<script setup lang="ts">
import type { VirtualFile, VirtualFileSystemTree } from '~/structures'

const props = defineProps<{
  name?: string
  directory?: VirtualFileSystemTree
  file?: VirtualFile
  depth: number
}>()

const play = usePlaygroundStore()
const isFileSelected = computed(() => props.file?.filepath === play.fileSelected?.filepath)

const isDirectoryOpen = ref(true)

function handleClick() {
  if (props.directory)
    isDirectoryOpen.value = !isDirectoryOpen.value
  else if (props.file)
    play.fileSelected = props.file
}

// put folders first and sort alphabetically
const sortedDirectory = computed(() => props.directory && Object.fromEntries(
  Object.entries(props.directory).sort(([aName, a], [bName, b]) => {
    if ('directory' in a && !('directory' in b))
      return -1
    if (!('directory' in a) && 'directory' in b)
      return 1
    return aName.localeCompare(bName)
  }),
))

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
  if (props.directory) {
    return isDirectoryOpen.value
      ? 'i-catppuccin-folder-open'
      : 'i-catppuccin-folder'
  }
  else {
    return getFileIcon(props.name!)
  }
})

const folderCaret = computed(() => {
  const icon = 'i-ph-caret-right transition-transform duration-300 op50'
  if (props.directory) {
    return isDirectoryOpen.value
      ? `${icon} rotate-90`
      : icon
  }
  else {
    return 'opacity-0'
  }
})
</script>

<template>
  <div of-auto>
    <button
      v-if="name"
      text-sm px2 py1 text-left w-full
      flex="~ gap-1 items-center"
      hover="bg-active"
      :class="isFileSelected ? 'bg-active' : 'text-faded'"
      :style="{
        paddingLeft: `${0.2 + 0.8 * (props.depth)}rem`,
      }"
      @click="handleClick"
    >
      <div :class="folderCaret" flex-none h-4 w-4 />
      <div :class="icon" flex-none h-4 w-4 light="brightness-60 hue-rotate-180 invert-100 saturate-200" scale-110 />
      <span ml1>{{ name }}</span>
    </button>
    <div v-if="directory" v-show="isDirectoryOpen">
      <PanelEditorFileSystemTree
        v-for="(child, chileName) in sortedDirectory"
        :key="chileName"
        :name="chileName.toString()"
        v-bind="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>
