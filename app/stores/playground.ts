import type { VirtualFile } from '~/structures/VirtualFile'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'ready',
] as const

export type PlaygroundStatus = typeof PlaygroundStatusOrder[number] | 'error'

export interface PlaygroundState {
  files: VirtualFile[]
  previewUrl: string
  previewLocation: {
    origin: string
    fullPath: string
  }
  error: { message: string } | undefined
  status: PlaygroundStatus
  stream: ReadableStream | undefined
  actions: PlaygroundActions
}

export interface PlaygroundActions {
  restartServer: () => Promise<void>
  downloadZip: () => Promise<void>
}

export const usePlaygroundStore = defineStore('playground', () => {
  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })

  const previewUrl = computed(() => previewLocation.value.origin + previewLocation.value.fullPath)

  const status = shallowRef<PlaygroundStatus>('init')
  const error = shallowRef<{ message: string }>()
  const stream = ref<ReadableStream>()

  const actions = {
    async restartServer() {},
    async downloadZip() {},
  }

  return { files: shallowRef([] as VirtualFile[]), previewUrl, previewLocation, error, status, stream, actions }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
