import type { ClientInfo } from '~/types/rpc'

export const usePreviewStore = defineStore('preview', () => {
  const location = ref({
    origin: '',
    fullPath: '',
  })
  const url = shallowRef('')
  const clientInfo = shallowRef<ClientInfo>()

  function updateUrl() {
    url.value = location.value.origin + location.value.fullPath
  }

  return {
    location,
    url,
    clientInfo,
    updateUrl,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePreviewStore, import.meta.hot))
