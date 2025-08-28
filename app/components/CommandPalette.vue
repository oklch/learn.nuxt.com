<script setup lang="ts">
import type { Command } from '~/stores/commands'
import { NuxtLink } from '#components'

const commands = useCommandsStore()
const router = useRouter()

const selected = ref(0)
const input = useTemplateRef('input')

function move(delta: number) {
  selected.value += delta
  if (selected.value < 0)
    selected.value = commands.commandsResult.length - 1
  if (selected.value >= commands.commandsResult.length)
    selected.value = 0
}

function runCommand(command: Command) {
  if (command.handler)
    command.handler()
  else if (command.to)
    router.push(command.to)
  commands.isShown = false
}

function scrollIntoView(elOrComponent?: any) {
  const el = elOrComponent?.$el || elOrComponent
  el?.scrollIntoView?.({
    block: 'nearest',
    inline: 'nearest',
  })
}

function getTitle(command: Command) {
  if (typeof command.title === 'function')
    return command.title()
  return command.title
}

// Reset selected when search changes
watch(
  () => commands.search,
  () => {
    selected.value = 0
  },
)

watch(
  () => commands.isShown,
  () => {
    if (commands.isShown) {
      commands.search = ''
      // Auto-focus on input open (nextTick because DOM not updated yet)
      nextTick(() => {
        input.value?.focus()
      })
    }
  },
)

useEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    commands.isShown = !commands.isShown
    e.preventDefault()
  }

  if (commands.isShown) {
    switch (e.key) {
      case 'Escape':
        commands.isShown = false
        e.preventDefault()
        break
      case 'ArrowUp':
        move(-1)
        e.preventDefault()
        break
      case 'ArrowDown':
        move(1)
        e.preventDefault()
        break
      case 'Enter':
        runCommand(commands.commandsResult[selected.value]!)
        e.preventDefault()
        break
    }
  }
})
</script>

<template>
  <div
    v-if="commands.isShown"
    inset-0 fixed z-command-palette flex="~ items-center justify-center"
  >
    <div
      bg-black:75 inset-0 absolute z--1
      @click="commands.isShown = false"
    />
    <div
      border="~ base rounded"
      bg-base h-100 w-200
      flex="~ col"
    >
      <div flex="~ items-center">
        <div class="i-ph-magnifying-glass-duotone" text-xl m4 />
        <input
          ref="input"
          v-model="commands.search"
          p4 pl0 outline-none border-none h-full w-full
          :placeholder="$t('search-dots')"
        >
      </div>
      <div border="t base" py2 of-auto flex="~ col">
        <component
          :is="c.to ? NuxtLink : 'button'"
          v-for="c, idx in commands.commandsResult"
          :key="c.id || getTitle(c)"
          :ref="(el: any) => selected === idx && scrollIntoView(el)"
          :to="c.to"
          flex="~ gap-2 items-center" mx1 p2 px3 rounded
          hover:bg-active
          :class="selected === idx ? 'bg-active' : ''"
          @click="runCommand(c)"
          @mouseenter="selected = idx"
        >
          <div :class="c.icon || 'i-ph-dot-duotone'" />
          {{ getTitle(c) }}
        </component>
      </div>
    </div>
  </div>
</template>
