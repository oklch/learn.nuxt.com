/* eslint-disable new-cap */
import type { Store } from './env'
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
      switch (label) {
        case 'typescript':
        case 'javascript':
          return new tsWorker()
        case 'vue':
          return new vueWorker()

        case 'json':
          return new jsonWorker()

        case 'css':
        case 'scss':
        case 'less':
          return new cssWorker()

        case 'html':
        case 'handlebars':
        case 'razor':
          return new htmlWorker()

        default:
          return new editorWorker()
      }
    },
  }

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  monaco.languages.register({ id: 'vue', extensions: ['.vue'] })
  monaco.languages.onLanguage('vue', () => reloadLanguageTools(store))
}
