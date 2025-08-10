<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import '../monaco/worker'

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
    case 'html':
      return 'html'
    default:
      return 'plaintext'
  }
})

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

const stop = watch(monacoEl, (el) => {
  if (!el)
    return
  stop()
  const editor = monaco.editor.create(el, {
    model: getModel(filepath),
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
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
</script>

<template>
  <div ref="monacoEl" />
</template>
