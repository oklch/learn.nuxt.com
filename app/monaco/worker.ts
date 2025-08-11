/* eslint-disable new-cap */
import type { Store, WorkerMessage } from './env'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { reloadLanguageTools } from './env'
import vueWorker from './vue.worker?worker'

export function initMonaco(store: Store) {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'vue') {
        const worker = new vueWorker()
        const init = new Promise<void>((resolve) => {
          worker.addEventListener('message', (data) => {
            if (data.data === 'inited') {
              resolve()
            }
          })
          worker.postMessage({
            event: 'init',
            tsVersion: store.typescriptVersion,
            tsLocale: undefined,
          } satisfies WorkerMessage)
        })
        await init
        return worker
      }
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    },
  }

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  monaco.languages.register({ id: 'vue', extensions: ['.vue'] })
  monaco.languages.onLanguage('vue', () => reloadLanguageTools(store))
}
