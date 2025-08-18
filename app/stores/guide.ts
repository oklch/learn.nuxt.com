import type { GuideMeta, PlaygroundFeatures } from '~/types/guides'

export const useGuideStore = defineStore('guide', () => {
  const play = usePlaygroundStore()
  const ui = useUiStore()
  const preview = usePreviewStore()

  const currentGuide = shallowRef<GuideMeta>()
  const features = ref<PlaygroundFeatures>({})
  const showingSolution = shallowRef(false)
  const embeddedDocs = shallowRef('')

  watch(features, () => {
    if (features.value.fileTree === true) {
      if (ui.panelFileTree <= 0)
        ui.panelFileTree = 20
    }
    else if (features.value.fileTree === false) {
      ui.panelFileTree = 0
    }

    if (features.value.terminal === true)
      ui.showTerminal = true
    else if (features.value.terminal === false)
      ui.showTerminal = false
  })

  async function mount(guide?: GuideMeta, withSolution = false) {
    await play.init

    // eslint-disable-next-line no-console
    console.log('mounting guide', guide)

    await play.mount({
      ...guide?.files,
      ...withSolution ? guide?.solutions : {},
    })

    play.fileSelected = play.files.get(guide?.startingFile || 'app.vue')
    preview.location.fullPath = guide?.startingUrl || '/'
    preview.updateUrl()

    features.value = guide?.features || {}
    currentGuide.value = guide
    showingSolution.value = withSolution
  }

  async function toggleSolutions() {
    await mount(currentGuide.value, !showingSolution.value)
  }

  function openEmbeddedDocs(url: string) {
    embeddedDocs.value = url
  }

  return {
    features,
    currentGuide,
    showingSolution,
    embeddedDocs,
    mount,
    toggleSolutions,
    openEmbeddedDocs,
  }
})
