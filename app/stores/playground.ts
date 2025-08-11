import type { WebContainer, WebContainerProcess } from '@webcontainer/api'
import type { VirtualFile } from '~/structures/VirtualFile'

export const PlaygroundStatusOrder = [
  'init',
  'mount',
  'install',
  'start',
  'ready',
] as const

export type PlaygroundStatus = typeof PlaygroundStatusOrder[number] | 'error'

export const usePlaygroundStore = defineStore('playground', () => {
  const webcontainer = shallowRef<WebContainer>()
  const files = shallowRef([] as VirtualFile[])
  const previewLocation = ref({
    origin: '',
    fullPath: '',
  })
  const previewUrl = ref('')
  const status = shallowRef<PlaygroundStatus>('init')
  const error = shallowRef<{ message: string }>()
  const fileSelected = shallowRef<VirtualFile>()

  const currentProcess = shallowRef<WebContainerProcess>()

  function updatePreviewUrl() {
    previewUrl.value = previewLocation.value.origin + previewLocation.value.fullPath
  }

  // Mount the playground on client side
  if (import.meta.client) {
    async function mount() {
      const colorMode = useColorMode()
      const { templates } = await import('../templates')
      const { files: _files, tree } = await templates.basic({
        nuxtrc: [
          // Have color mode on initial load
          colorMode.value === 'dark'
            ? 'app.head.htmlAttrs.class=dark'
            : '',
        ],
      })
      files.value = _files

      // Inject .nuxtrc so that we can have the color mode on initial load
      if (colorMode.value === 'dark') {
        tree['.nuxtrc'] = {
          file: {
            contents: `app.head.htmlAttrs.class=dark`,
          },
        }
      }

      // if (import.meta.dev)
      //   return

      const wc = await import('@webcontainer/api')
        .then(({ WebContainer }) => WebContainer.boot())
      webcontainer.value = wc
      _files.forEach((file) => {
        file.wc = wc
      })

      wc.on('server-ready', (port, url) => {
        // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
        // We need the main one
        if (port === 3000) {
          previewLocation.value = {
            origin: url,
            fullPath: '/',
          }
          updatePreviewUrl()
        }
      })
      wc.on('error', (err) => {
        status.value = 'error'
        error.value = err
      })

      status.value = 'mount'
      await wc.mount(tree)

      startServer()

      // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
      if (import.meta.hot) {
        import.meta.hot.accept(() => {
          killPreviousProcess()
        })
      }
    }
    mount()
  }

  let abortController: AbortController | undefined

  function killPreviousProcess() {
    abortController?.abort()
    abortController = undefined
    currentProcess.value?.kill()
    currentProcess.value = undefined
  }

  async function startServer() {
    if (!import.meta.client)
      return
    killPreviousProcess()

    const wc = webcontainer.value!
    abortController = new AbortController()
    const signal = abortController.signal

    await launchDefaultProcess(wc, signal)
    await launchInteractiveProcess(wc, signal)
  }

  async function spawn(wc: WebContainer, command: string, args: string[] = []) {
    const process = await wc.spawn(command, args)
    currentProcess.value = process
    return process.exit.then((r) => {
      return r
    })
  }

  async function launchDefaultProcess(wc: WebContainer, signal: AbortSignal) {
    status.value = 'install'

    if (signal.aborted)
      return

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
    status.value = 'start'
    await spawn(wc, 'pnpm', ['run', 'dev', '--no-qr'])
  }

  async function launchInteractiveProcess(wc: WebContainer, signal: AbortSignal) {
    if (signal.aborted)
      return
    await spawn(wc, 'jsh')
  }

  async function downloadZip() {
    if (!import.meta.client)
      return
    const wc = webcontainer.value!

    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    type Zip = typeof zip

    async function crawlFiles(dir: string, zip: Zip) {
      const files = await wc.fs.readdir(dir, { withFileTypes: true })

      await Promise.all(
        files.map(async (file) => {
          if (isFileIgnored(file.name))
            return

          if (file.isFile()) {
            // TODO: If it's package.json, we modify to remove some fields
            const content = await wc.fs.readFile(`${dir}/${file.name}`, 'utf8')
            zip.file(file.name, content)
          }
          else if (file.isDirectory()) {
            const folder = zip.folder(file.name)!
            return crawlFiles(`${dir}/${file.name}`, folder)
          }
        }),
      )
    }
    await crawlFiles('.', zip)

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const date = new Date()
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
    const link = document.createElement('a')
    link.href = url
    // TODO: have a better name with the current tutorial name
    link.download = `nuxt-playground-${dateString}.zip`
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return {
    webcontainer,
    files,
    previewLocation,
    previewUrl,
    status,
    error,
    currentProcess,
    fileSelected,
    restartServer: startServer,
    downloadZip,
    updatePreviewUrl,
  }
})

export type PlaygroundStore = ReturnType<typeof usePlaygroundStore>

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlaygroundStore, import.meta.hot))
