<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'
import { filesToVirtualFsTree } from '~/templates/utils'

const { files: allFiles = [] } = defineProps<{
  files?: VirtualFile[]
}>()

const files = computed(() => allFiles.filter(file => !isFileIgnored(file.filepath)))
const directory = computed(() => filesToVirtualFsTree(files.value))

const play = usePlaygroundStore()

const input = ref<string>()

// Select the first file by default.
watchEffect(() => {
  if (play.fileSelected == null && files.value.length > 0)
    play.fileSelected = files.value[0]
})

watch(() => play.fileSelected, () => {
  input.value = play.fileSelected?.read()
})

function onTextInput() {
  if (input.value != null)
    play.fileSelected?.write(input.value)
}
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" px4 py2 border="b base dashed" bg-faded>
      <div i-ph-text-t-duotone />
      <span text-sm>Editor</span>
    </div>
    <div grid="~ cols-[1fr_2fr]" h-full of-hidden>
      <div flex="~ col" h-full of-auto>
        <PanelEditorFileSystemTree :directory="directory" :depth="-1" />
      </div>
      <textarea
        v-model="input"
        border="l base"
        font-mono p4 bg-transparent h-full w-full resize-none
        @input="onTextInput"
      />
    </div>
  </div>
</template>
