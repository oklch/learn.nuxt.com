import type { WorkerLanguageService } from '@volar/monaco/worker'
import type { CreateData } from './vue.worker'
import * as volar from '@volar/monaco'
import { editor, languages, Uri } from 'monaco-editor'
import { getOrCreateModel } from './utils'

export class Store {
  vueVersion = '3.5.18'
  typescriptVersion = '5.9.2'
  getTsConfig = () => ({})
  files: string[] = []
}

export class WorkerHost {
  onFetchCdnFile(uri: string, text: string) {
    getOrCreateModel(Uri.parse(uri), undefined, text)
  }
}

let disposeVue: undefined | (() => void)
export async function reloadLanguageTools(store: Store) {
  disposeVue?.()

  let dependencies: Record<string, string> = {}

  if (store.vueVersion) {
    dependencies = {
      'vue': store.vueVersion,
      '@vue/compiler-core': store.vueVersion,
      '@vue/compiler-dom': store.vueVersion,
      '@vue/compiler-sfc': store.vueVersion,
      '@vue/compiler-ssr': store.vueVersion,
      '@vue/reactivity': store.vueVersion,
      '@vue/runtime-core': store.vueVersion,
      '@vue/runtime-dom': store.vueVersion,
      '@vue/shared': store.vueVersion,
    }
  }

  if (store.typescriptVersion) {
    dependencies = {
      ...dependencies,
      typescript: store.typescriptVersion,
    }
  }

  const worker = editor.createWebWorker<WorkerLanguageService>({
    moduleId: 'vs/language/vue/vueWorker',
    label: 'vue',
    host: new WorkerHost(),
    createData: {
      tsconfig: store.getTsConfig?.() || {},
      dependencies,
    } satisfies CreateData,
  })
  const languageId = ['vue', 'javascript', 'typescript']
  const getSyncUris = () => {
    const files = store.files.map(filename =>
      Uri.parse(`file:///${filename}`),
    )
    return files
  }

  const { dispose: disposeMarkers } = volar.activateMarkers(
    worker,
    languageId,
    'vue',
    getSyncUris,
    editor,
  )
  const { dispose: disposeAutoInsertion } = volar.activateAutoInsertion(
    worker,
    languageId,
    getSyncUris,
    editor,
  )
  const { dispose: disposeProvides } = await volar.registerProviders(
    worker,
    languageId,
    getSyncUris,
    languages,
  )

  disposeVue = () => {
    disposeMarkers()
    disposeAutoInsertion()
    disposeProvides()
  }
}

export interface WorkerMessage {
  event: 'init'
  tsVersion: string
  tsLocale?: string
}
