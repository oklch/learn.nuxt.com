import type { WebContainer, WebContainerProcess } from '@webcontainer/api'
import type { Raw } from 'vue'
import { VirtualFile } from '~/structures'
import { filesToWebContainerFs } from '~/templates/utils'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'polling',
  'ready',
  'interactive',
] as const

export type PlaygroundStatus = typeof PlaygroundStatusOrder[number] | 'error'

export const usePlaygroundStore = defineStore('playground', () => {
  const preview = usePreviewStore()

  const webcontainer = shallowRef<WebContainer>()
  const files = shallowReactive<Raw<Map<string, VirtualFile>>>(new Map())
  const status = shallowRef<PlaygroundStatus>('init')
  const error = shallowRef<{ message: string }>()
  const fileSelected = shallowRef<VirtualFile>()
  const currentProcess = shallowRef<WebContainerProcess>()

  let filesTemplate: Record<string, string>
  let _promiseInit: Promise<void> | undefined

  // Mount the playground on client side
  if (import.meta.client) {
    async function init() {
      const colorMode = useColorMode()

      const [
        wc,
        filesRaw,
      ] = await Promise.all([
        import('@webcontainer/api')
          .then(({ WebContainer }) => WebContainer.boot()),

        import('../templates')
          .then(r => r.templates.basic({
            nuxtrc: [
              // Have color mode on initial load
              colorMode.value === 'dark'
                ? 'app.head.htmlAttrs.class=dark'
                : '',
            ],
          })),
      ])

      filesTemplate = filesRaw

      webcontainer.value = wc
      Object.entries(filesRaw)
        .forEach(([path, content]) => {
          files.set(path, new VirtualFile(path, content, wc))
        })

      wc.on('server-ready', (port, url) => {
        // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
        // We need the main one
        if (port === 3000) {
          preview.location = {
            origin: url,
            fullPath: '/',
          }
          preview.updateUrl()
          status.value = 'polling'
        }
      })
      wc.on('error', (err) => {
        status.value = 'error'
        error.value = err
      })

      status.value = 'mount'
      await wc.mount(filesToWebContainerFs([...files.values()]))

      startServer()

      // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
      if (import.meta.hot) {
        import.meta.hot.accept(() => {
          killPreviousProcess()
        })
      }
    }

    _promiseInit = init()
  }

  let abortController: AbortController | undefined

  function killPreviousProcess() {
    abortController?.abort()
    abortController = undefined
    currentProcess.value?.kill()
    currentProcess.value = undefined
  }

  let hasInstalled = false

  async function startServer(reinstall = false) {
    if (!import.meta.client)
      return
    killPreviousProcess()

    const wc = webcontainer.value!
    abortController = new AbortController()
    const signal = abortController.signal

    if (reinstall)
      hasInstalled = false
    if (!hasInstalled)
      await launchInstallProcess(wc, signal)
    if (hasInstalled)
      await launchNuxtProcess(wc, signal)
    await launchInteractiveProcess(wc, signal)
  }

  async function spawn(wc: WebContainer, command: string, args: string[] = []) {
    const process = await wc.spawn(command, args)
    currentProcess.value = process
    return process.exit.then((r) => {
      return r
    })
  }

  async function launchInstallProcess(wc: WebContainer, signal: AbortSignal) {
    if (signal.aborted)
      return

    status.value = 'install'
    const installExitCode = await spawn(wc, 'pnpm', ['install'])
    if (signal.aborted)
      return

    if (installExitCode !== 0) {
      status.value = 'error'
      error.value = {
        message: `Unable to run pnpm install, exit as ${installExitCode}`,
      }
      console.error('Unable to run pnpm install')
      return
    }
    hasInstalled = true
  }

  async function launchNuxtProcess(wc: WebContainer, signal: AbortSignal) {
    if (signal.aborted)
      return
    status.value = 'start'
    await spawn(wc, 'pnpm', ['run', 'dev', '--no-qr'])
  }

  async function launchInteractiveProcess(wc: WebContainer, signal: AbortSignal) {
    if (signal.aborted)
      return
    status.value = 'interactive'
    await spawn(wc, 'jsh')
  }

  async function _updateOrCreateFile(filepath: string, content: string) {
    const file = files.get(filepath)
    if (file) {
      if (file.read() !== content)
        await file.write(content)
      return file
    }
    else {
      const newFile = new VirtualFile(filepath, content, webcontainer.value!)
      files.set(filepath, newFile)
      await newFile.write(content)
      return newFile
    }
  }

  /**
   * Mount files to WebContainer.
   * This will do a diff with the current files and only update the ones that changed
   */
  async function mount(map: Record<string, string>, templates = filesTemplate) {
    const objects = {
      ...templates,
      ...map,
    }

    await Promise.all([
      ...Object.entries(objects)
        .map(async ([filepath, content]) => {
          await _updateOrCreateFile(filepath, content)
        }),
      ...Array.from(files.keys())
        .filter(filepath => !(filepath in objects))
        .map(async (filepath) => {
          const file = files.get(filepath)
          await file?.remove()
          files.delete(filepath)
        }),
    ])
  }

  return {
    get init() {
      return _promiseInit
    },
    webcontainer,
    files,
    status,
    error,
    currentProcess,
    fileSelected,
    restartServer: startServer,
    mount,
  }
})

export type PlaygroundStore = ReturnType<typeof usePlaygroundStore>

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
