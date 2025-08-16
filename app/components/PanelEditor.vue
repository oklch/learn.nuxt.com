<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { filesToVirtualFsTree } from '~/templates/utils'

const play = usePlaygroundStore()
const files = computed(() => Array.from(play.files.values()).filter(file => !isFileIgnored(file.filepath)))
const directory = computed(() => filesToVirtualFsTree(files.value))

const input = ref<string>()

watch(() => [play.fileSelected, play.mountedGuide], () => {
  input.value = play.fileSelected?.read() || ''
})

const debouncedWrite = useDebounceFn((value: string) => {
  play.fileSelected?.write(value)
}, 300)

watch(input, (currentInput, previousInput) => {
  if (currentInput != null && currentInput !== previousInput) {
    debouncedWrite(currentInput)
  }
})

const ui = useUiState()
const startDragging = useThrottleFn(() => {
  ui.isPanelDragging = true
}, 1000)
function endDragging(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelFileTree = e[0]!.size
}

// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitFileTree = computed(() => isMounted.value || {
  width: `${ui.panelFileTree}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  width: `${100 - ui.panelFileTree}%`,
})
</script>

<template>
  <div h-full grid="~ rows-[min-content_1fr]">
    <div flex="~ gap-2 items-center" px4 py2 border="b base dashed" bg-faded>
      <div i-ph-text-t-duotone />
      <span text-sm>Editor</span>
    </div>
    <Splitpanes
      h-full of-hidden
      @resize="startDragging"
      @resized="endDragging"
    >
      <Pane
        flex="~ col" py1 h-full of-auto
        :size="ui.panelFileTree"
        :style="panelInitFileTree"
      >
        <PanelEditorFileSystemTree :directory="directory" :depth="-1" />
      </Pane>
      <PaneSplitter />
      <Pane
        :size="100 - ui.panelFileTree"
        :style="panelInitEditor"
      >
        <LazyPanelEditorMonaco
          v-if="play.fileSelected"
          v-model="input"
          class="h-full w-full"
          :filepath="play.fileSelected.filepath"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
