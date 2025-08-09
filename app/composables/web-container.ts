import type { WebContainerProcess } from '@webcontainer/api'
import type { PlaygroundState } from '~/stores/playground'
import { WebContainer } from '@webcontainer/api'
import { templates } from '~/templates'

if (import.meta.server)
  throw new Error('This file should not be imported on the server')

let _webcontainerPromise: Promise<WebContainer>

export async function useWebContainer() {
  if (!_webcontainerPromise) {
    _webcontainerPromise = WebContainer.boot()
  }
  return await _webcontainerPromise
}

export async function mountPlayground(play: PlaygroundState, colorMode: string) {
  const { files, tree } = await templates.basic({
    nuxtrc: [
      // Have color mode on initial load
      colorMode === 'dark'
        ? 'app.head.htmlAttrs.class=dark'
        : '',
    ],
  })

  // Inject .nuxtrc so that we can have the color mode on initial load
  if (colorMode === 'dark') {
    tree['.nuxtrc'] = {
      file: {
        contents: `app.head.htmlAttrs.class=dark`,
      },
    }
  }

  const wc = await useWebContainer()
  files.forEach((file) => {
    file.wc = wc
  })
  play.files = files

  wc.on('server-ready', (port, url) => {
    // Nuxt listen to multiple ports, and 'server-ready' is emitted for each of them
    // We need the main one
    if (port === 3000) {
      play.previewLocation = {
        origin: url,
        fullPath: '/',
      }
    }
  })
  wc.on('error', (err) => {
    play.status = 'error'
    play.error = err
  })

  play.status = 'mount'
  await wc.mount(tree)

  let processInstall: WebContainerProcess | undefined
  let processDev: WebContainerProcess | undefined

  function killPreviousProcess() {
    processInstall?.kill()
    processDev?.kill()
  }

  async function startServer() {
    killPreviousProcess()
    play.status = 'install'
    processInstall = await wc.spawn('pnpm', ['install'])
    play.stream = processInstall.output
    const installExitCode = await processInstall.exit
    if (installExitCode !== 0) {
      play.status = 'error'
      play.error = {
        message: `Unable to run npm install, exit as ${installExitCode}`,
      }
      throw new Error('Unable to run pnpm install')
    }
    play.status = 'start'
    processDev = await wc.spawn('pnpm', ['run', 'dev'])
    play.stream = processDev.output
  }

  startServer()
  play.actions.restartServer = startServer

  async function downloadZip() {
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

  play.actions.downloadZip = downloadZip

  // In dev, when doing HMR, we kill the previous process while reusing the same WebContainer
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      killPreviousProcess()
    })
  }
}
