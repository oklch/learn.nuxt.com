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
  <div grid="~ cols-[1fr_2fr]" flex-grow>
    <div text-red border="r base" p-4>
      Hello World {{ x }}, {{ y }}<br>

      <button @click="toggleDark">
        {{ color.value }}
      </button>
    </div>
    <ThePlayground />
  </div>
</template>
