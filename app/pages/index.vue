<script setup lang="ts">
const { x, y } = useMouse()
</script>

<template>
  <div grid="~ cols-[1fr_2fr]" flex-grow>
    <div text-red border="r base" p-4>
      Hello World {{ x }}, {{ y }}<br>
    </div>
    <ThePlayground />
  </div>
</template>
