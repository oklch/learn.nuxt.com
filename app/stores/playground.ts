import type { VirtualFile } from '~/structures/VirtualFile'

export type PlaygroundStatus = 'init' | 'mount' | 'install' | 'start' | 'ready' | 'error'

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

  return { files: ref([]), previewUrl, previewLocation, error, status, stream }
})
