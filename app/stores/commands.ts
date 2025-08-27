import Fuse from 'fuse.js'

export interface Command {
  id?: string
  title: string
  to?: string
  description?: string
  visible?: () => boolean
  handler?: () => void
  icon?: string
}

export const useCommandsStore = defineStore('commands', () => {
  const search = shallowRef('')
  const isShown = shallowRef(false)
  const commandsIcons = shallowReactive<Set<Command>>(new Set())
  const guidesResult = shallowRef<Command[]>([])

  const fuseIcons = computed(() => new Fuse(Array.from(commandsIcons), {
    keys: ['title', 'description'],
    threshold: 0.3,
  }))

  const fuseGuides = computed(() => new Fuse(Array.from(guidesResult.value), {
    keys: ['title', 'description'],
    threshold: 0.3,
  }))

  const debouncedSearch = refDebounced(search, 100)

  const { locale } = useI18n()

  const { data: sections } = useAsyncData(`${locale.value}-search-sections`, () => {
    return queryCollectionSearchSections(locale.value as 'en')
  })

  watch(debouncedSearch, async (v) => {
    if (v) {
      guidesResult.value = sections.value
        ?.filter(x => !x.id.includes('#')) // h2
        ?.map((i): Command => ({
          id: i.id,
          title: i.title || 'Untitled',
          to: i.id,
          icon: 'i-ph-file-duotone',
        })) || []
    }
    else {
      guidesResult.value = []
    }
  })

  const commandsResult = computed(() => {
    const result = !search.value
      ? Array.from(commandsIcons)
      : [
          ...fuseIcons.value.search(search.value).map(i => i.item),
          ...fuseGuides.value.search(search.value).map(i => i.item),
        ]
    return result.filter(i => i.visible ? i.visible() : true)
  })

  return {
    search,
    isShown,
    commandsIcons,
    commandsResult,
  }
})

export function addCommands(...inputs: Command[]) {
  const commands = useCommandsStore()

  onMounted(() => {
    for (const command of inputs)
      commands.commandsIcons.add(command)
  })

  onUnmounted(() => {
    for (const command of inputs)
      commands.commandsIcons.delete(command)
  })
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCommandsStore, import.meta.hot))
