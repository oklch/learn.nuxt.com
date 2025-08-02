<script setup lang="ts">
const { x, y } = useMouse()
const color = useColorMode()

function toggleDark() {
  color.value = color.value === 'dark'
    ? 'light'
    : 'dark'
}
</script>

<template>
  <div grid="~ cols-[1fr_2fr]" h-full>
    <div text-red border="r base" p-4>
      Hello World {{ x }}, {{ y }}<br>

      <button @click="toggleDark">
        {{ color.value }}
      </button>
    </div>
    <div p-4>
      Playground
    </div>
  </div>
</template>
