<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const guide = useGuideStore()

const ui = useUiStore()
function startDragging() {
  ui.isPanelDragging = true
}
function endDraggingVertical(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelDocs = e[0]!.size
}
function endDraggingHorizontal(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelEditor = e[0]!.size
  ui.panelPreview = e[1]!.size
}
function draggingEmbeddedDocs(e: { size: number }[]) {
  ui.isPanelDragging = true
  ui.panelDocs = e[0]!.size
}

const terminalPaneProps = computed(() => {
  if (ui.showTerminal) {
    return {
      size: 100 - ui.panelEditor - ui.panelPreview,
    }
  }
  else {
    return {
      size: 0,
      maxSize: 0,
    }
  }
})

// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitDocs = computed(() => isMounted.value || {
  width: `${ui.panelDocs}%`,
})
const panelInitRight = computed(() => isMounted.value || {
  width: `${100 - ui.panelDocs}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  height: `${ui.panelEditor}%`,
})
const panelInitPreview = computed(() => isMounted.value || {
  height: `${ui.panelPreview}%`,
})
const panelInitTerminal = computed(() => isMounted.value || {
  height: `${100 - ui.panelEditor - ui.panelPreview}%`,
})
</script>

<template>
  <Splitpanes
    h-full of-hidden
    :class="{ 'splitpanes--dragging': ui.isPanelDragging }"
    @resize="draggingEmbeddedDocs"
    @resized="endDraggingVertical"
  >
    <Pane :size="ui.panelDocs" min-size="10" :style="panelInitDocs">
      <PanelDocs />
    </Pane>
    <PaneSplitter />
    <Pane :size="100 - ui.panelDocs" :style="panelInitRight">
      <Splitpanes
        horizontal relative
        class="h-full of-hidden"
        :class="guide.embeddedDocs ? 'z-embedded-docs-raised' : ''"
        @resize="startDragging"
        @resized="endDraggingHorizontal"
      >
        <Pane :size="ui.panelEditor" min-size="10" :style="panelInitEditor">
          <PanelEditor />
        </Pane>
        <PaneSplitter />
        <Pane :size="ui.panelPreview" min-size="10" :style="panelInitPreview">
          <PanelPreview />
        </Pane>
        <PaneSplitter />
        <Pane
          v-bind="terminalPaneProps" :style="panelInitTerminal"
          :class="ui.showTerminal ? '' : 'pane-hidden'"
        >
          <PanelTerminal />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>

  <Transition name="slide-fade">
    <Splitpanes
      v-if="guide.embeddedDocs"
      inset-0 fixed z-embedded-docs
      :class="{ 'splitpanes--dragging': ui.isPanelDragging }"
      @resize="draggingEmbeddedDocs"
      @resized="endDraggingVertical"
    >
      <Pane class="relative" :size="ui.panelDocs" min-size="10" :style="panelInitDocs">
        <iframe
          :class="{ 'pointer-events-none': ui.isPanelDragging }"
          :src="guide.embeddedDocs"
          allow="cross-origin-isolated" credentialless
          h-full w-full inset-0
        />
      </Pane>
      <Pane class="relative important-of-visible" :size="100 - ui.panelDocs" :style="panelInitRight">
        <div
          border="~ base" rounded-full bg-base h-8 w-8 left--4 top-4 absolute z-embedded-docs-close
        >
          <button
            flex="~ items-center justify-center"
            h-full w-full hover:bg-active
            title="Close embedded docs"
            @click="guide.embeddedDocs = ''"
          >
            <div i-ph-caret-left-bold h-4 w-4 />
          </button>
        </div>
      </Pane>
    </Splitpanes>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-30vw);
  opacity: 0;
}
</style>
