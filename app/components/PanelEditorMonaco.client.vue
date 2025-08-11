<script setup lang="ts">
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { Store } from '~/monaco/env'
import { getShiki } from '~/monaco/shiki'
import { initMonaco } from '../monaco/worker'

const { filepath } = defineProps<{
  filepath: string
}>()
const code = defineModel<string>({ default: '' })
const monacoEl = useTemplateRef('monacoEl')

const models = new Map<string, monaco.editor.ITextModel>()

const language = computed(() => {
  const ext = filepath.split('.').pop()
  switch (ext) {
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'vue':
      return 'vue'
    case 'html':
      return 'html'
    default:
      return 'plaintext'
  }
})

const play = usePlaygroundStore()
const store = new Store()

watchEffect(() => {
  store.files = play.files.map(i => i.filepath)
})
initMonaco(store)

const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark'
  ? 'vitesse-dark'
  : 'vitesse-light',
)

function getModel(filepath: string) {
  let model: monaco.editor.ITextModel
  if (!models.has(filepath)) {
    model = monaco.editor.createModel(
      code.value,
      language.value,
      monaco.Uri.file(filepath),
    )
    models.set(filepath, model)
  }
  else {
    model = models.get(filepath)!
  }
  model.setValue(code.value)
  return model
}

const stop = watch(monacoEl, async (el) => {
  if (!el)
    return
  stop()
  const shiki = await getShiki()
  shikiToMonaco(shiki, monaco)
  const editor = monaco.editor.create(el, {
    'model': getModel(filepath),
    'theme': theme.value,
    'fontSize': 14,
    'bracketPairColorization': {
      enabled: false,
    },
    'glyphMargin': false,
    'automaticLayout': true,
    'folding': false,
    'lineDecorationsWidth': 10,
    'lineNumbersMinChars': 3,
    'fontFamily': 'DM Mono, monospace',
    'minimap': {
      enabled: false,
    },
    'padding': {
      top: 8,
    },
    'semanticHighlighting.enabled': true,
    'overviewRulerLanes': 0,
  })
  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue()
  })
  watch(
    () => filepath,
    () => {
      editor.setModel(getModel(filepath))
    },
  )
})

watch(theme, () => monaco.editor.setTheme(theme.value))
</script>

<template>
  <div ref="monacoEl" />
</template>
