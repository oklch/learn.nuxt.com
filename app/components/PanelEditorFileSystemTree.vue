<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'
import type { VirtualFileSystemTree } from '~/structures/VirtualFileSystemTree'

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
</script>

<template>
  <div of-auto>
    <div
      v-if="name"
      hover="bg-active"
      :style="{
        paddingLeft: `${0.5 * (props.depth)}rem`,
      }"
      @click="handleClick"
    >
      <button
        px2 py1 text-left
        :class="{
          'text-primary': isFileSelected,
        }"
        flex="~ gap-2 items-center"
      >
        <div v-if="directory && !isDirectoryOpen" i-ph-folder-duotone />
        <div v-if="directory && isDirectoryOpen" i-ph-folder-open-duotone />
        <div v-if="!directory" i-ph-file-duotone />
        {{ name }}
      </button>
    </div>
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
