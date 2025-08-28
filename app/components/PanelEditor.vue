<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { filesToVirtualFsTree } from '~/templates/utils'

const guide = useGuideStore()
const play = usePlaygroundStore()
const files = computed(() => Array.from(play.files.values()).filter(file => !isFileIgnored(file.filepath)))
const directory = computed(() => filesToVirtualFsTree(files.value))

const input = ref<string>()

watch(() => [play.fileSelected, guide.currentGuide, guide.showingSolution], () => {
  input.value = play.fileSelected?.read() || ''
})

const debouncedWrite = useDebounceFn((value: string) => {
  play.fileSelected?.write(value)
}, 300)

watch(input, () => {
  if (input.value != null) {
    debouncedWrite(input.value)
  }
})

const ui = useUiStore()
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
  <Splitpanes
    h-full of-hidden
    :class="guide.features.fileTree === false ? 'disabled' : ''"
    @resize="startDragging"
    @resized="endDragging"
  >
    <Pane
      flex="~ col" h-full of-auto
      :size="ui.panelFileTree"
      :style="panelInitFileTree"
    >
      <div h-full grid="~ rows-[min-content_1fr]">
        <div
          flex="~ gap-2 items-center"
          border="b base dashed"
          px4 py2 bg-faded
        >
          <div i-ph-tree-structure-duotone />
          <span text-sm>{{ $t('files') }}</span>
        </div>
        <div py2>
          <PanelEditorFileSystemTree
            v-model="play.fileSelected"
            :directory="directory"
            :depth="-1"
          />
        </div>
      </div>
    </Pane>
    <PaneSplitter />
    <Pane
      :size="100 - ui.panelFileTree"
      :style="panelInitEditor"
    >
      <div h-full grid="~ rows-[min-content_1fr]">
        <div flex="~ gap-2 items-center" px4 py2 border="b base dashed" bg-faded>
          <FileIcon :path="play.fileSelected?.filepath || ''" />
          <span text-sm>{{ play.fileSelected?.filepath || 'Editor' }}</span>
          <div flex-auto />
          <ButtonShowSolution
            text-sm my--1 mr--3 px2 py1 rounded op50 flex-none
            hover="bg-active op100"
          />
        </div>
        <LazyPanelEditorMonaco
          v-if="play.fileSelected"
          v-model="input"
          class="h-full w-full"
          :filepath="play.fileSelected.filepath"
        />
      </div>
    </Pane>
  </Splitpanes>
</template>
