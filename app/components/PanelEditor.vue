<script setup lang="ts">
import type { VirtualFile } from '~/structures/VirtualFile'

const { files: allFiles = [] } = defineProps<{
  files?: VirtualFile[]
}>()

const INGORE_FILES = [
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.npmrc',
  'tsconfig.json',
  'server/tsconfig.json',
]

const files = computed(() => allFiles.filter(file => !INGORE_FILES.includes(file.filepath)))

const selectedFile = ref<VirtualFile>()

// Select the first file by default.
watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0]!)
})

const input = ref<string>()

function selectFile(file: VirtualFile) {
  selectedFile.value = file
  input.value = file.read()
}

function onTextInput() {
  if (input.value != null)
    selectedFile?.value?.write(input.value)
}
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" px4 py2 border="b base dashed" bg-faded>
      <div i-ph-text-t-duotone />
      <span text-sm>Editor</span>
    </div>
    <div grid="~ cols-[1fr_2fr]" h-full of-auto>
      <div flex="~ col" h-full of-auto>
        <button
          v-for="file in files" :key="file.filepath"
          px2 py1 hover="bg-active" text-left
          :class="{
            'text-primary': file.filepath === selectedFile?.filepath,
          }"
          @click="selectFile(file)"
        >
          {{ file.filepath }}
        </button>
      </div>
      <textarea
        v-model="input"
        border="l base"
        font-mono p4 bg-transparent h-full w-full
        @input="onTextInput"
      />
    </div>
  </div>
</template>
