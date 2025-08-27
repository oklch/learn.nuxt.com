<script setup lang="ts">
const ui = useUiStore()
const play = usePlaygroundStore()
const guide = useGuideStore()
const commands = useCommandsStore()

const runtime = useRuntimeConfig()

const buildTime = new Date(runtime.public.buildTime)
const timeAgo = useTimeAgo(buildTime)

const id = useId()

const i18n = useI18n()

addCommands(
  {
    id: 'download-zip',
    title: 'Download playground as ZIP',
    visible: () => {
      return play.status === 'ready' && guide.features.download !== false
    },
    handler: () => {
      downloadZip(play.webcontainer!)
    },
    icon: 'i-ph-download-duotone',
  },
  {
    id: 'toggle-terminal',
    title: 'Toggle terminal',
    handler: () => {
      ui.toggleTerminal()
    },
    icon: 'i-ph-terminal-window-duotone',
  },
  {
    id: 'language-en',
    title: 'Change to English',
    handler: () => {
      i18n.setLocale('en')
    },
    icon: 'i-ph-globe-duotone',
    visible: () => {
      return i18n.locale.value !== 'en'
    },
  },
)
</script>

<template>
  <nav flex="~ items-center" p="x4 y3" border="b base">
    <NuxtLink to="/" title="Nuxt Tutorial">
      <NuxtTutorialLogo class="h-2em" />
    </NuxtLink>
    <NuxtLink
      :href="runtime.public.repoUrl"
      target="_blank"
    >
      <div text-xs text-orange px2 py1 rounded bg-orange:10 block translate-y--2>
        Work in Progress
      </div>
    </NuxtLink>
    <div flex-auto />
    <div
      flex="~ gap-1 items-center"
      :class="guide.embeddedDocs ? 'z-embedded-docs-raised' : ''"
    >
      <button
        v-if="play.status === 'ready' && guide.features.download !== false"
        p2 rounded
        hover="bg-active"
        title="Download as ZIP"
        @click="downloadZip(play.webcontainer!)"
      >
        <div i-ph-download-duotone text-2xl />
      </button>
      <VDropdown :distance="6">
        <button
          p2 rounded
          hover="bg-active"
          title="Languages"
        >
          <div i-ph-translate-duotone text-2xl />
        </button>
        <template #popper>
          <div flex="~ col gap-y-1" p2>
            <button
              v-for="locale of i18n.locales.value" :key="locale.code"
              px2 py1 rounded
              hover="bg-active"
              :class="locale.code === i18n.locale.value ? 'text-primary' : ''"
              @click="i18n.setLocale(locale.code)"
            >
              {{ locale.name }}
            </button>
          </div>
        </template>
      </VDropdown>
      <button
        p2 rounded
        hover="bg-active"
        title="Search"
        @click="commands.isShown = true"
      >
        <div i-ph-magnifying-glass-duotone text-2xl />
      </button>
      <VDropdown :distance="6" :aria-id="id">
        <button
          p2 rounded
          hover="bg-active"
          title="Playground Information"
        >
          <div i-ph-info-duotone text-2xl />
        </button>
        <template #popper>
          <div px5 py4 grid="~ gap-y-3 gap-x-2 cols-[max-content_1fr] items-center">
            <div i-ph-package-duotone text-xl />
            <NuxtLink :to="`${runtime.public.repoUrl}/commit/${runtime.public.gitSha}`" target="_blank" title="View on GitHub">
              <time :datetime="buildTime.toISOString()" :title="buildTime.toLocaleString()">
                Built {{ timeAgo }} (<code>{{ runtime.public.gitSha.slice(0, 5) }}</code>)
              </time>
            </NuxtLink>
          </div>
        </template>
      </VDropdown>
      <button
        p2 rounded
        title="Toggle terminal"
        hover="bg-active"
        :class="ui.showTerminal ? '' : 'op50'"
        @click="ui.toggleTerminal()"
      >
        <div i-ph-terminal-window-duotone text-2xl />
      </button>
      <ColorSchemeToggle />
      <NuxtLink
        p-2 rounded hover:bg-active
        title="GitHub"
        :href="runtime.public.repoUrl"
        target="_blank"
      >
        <div i-carbon-logo-github text-2xl />
      </NuxtLink>
    </div>
  </nav>
</template>
