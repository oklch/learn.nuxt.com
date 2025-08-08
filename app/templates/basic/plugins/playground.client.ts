import type { FrameFunctions, ParentFunctions } from '../../../types/rpc'
import { createBirpc } from 'birpc'

export default defineNuxtPlugin(() => {
  const frameFunctions: FrameFunctions = {
    onColorModeChange: (colorMode) => {
      document.documentElement.classList.toggle(
        'dark',
        colorMode === 'dark',
      )
    },
  }

  const rpc = createRpc(frameFunctions)

  // Communicate with parent window for navigation
  const router = useRouter()
  router.afterEach((to) => {
    rpc.onNavigate(to.fullPath)
  })

  rpc.onReady()
})

function createRpc(frameFunctions: FrameFunctions) {
  const rpc = createBirpc<ParentFunctions, FrameFunctions>(frameFunctions, {
    post: (payload) => {
      window.parent.postMessage({
        source: 'nuxt-playground-frame',
        payload,
      }, '*')
    },
    on: (fn) => {
      window.addEventListener('message', (event) => {
        if (event.data.source !== 'nuxt-playground-parent')
          return
        fn(event.data.payload)
      })
    },
  })
  return rpc
}
