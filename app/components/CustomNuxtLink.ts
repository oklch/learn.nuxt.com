const NuxtLink = defineNuxtLink({})

// Wrapping NuxtLink with custom handling for nuxt.com links
export default defineComponent({
  name: 'NuxtLink',
  props: NuxtLink.props,
  setup(props: any, { slots }) {
    const url = (props.to || props.href) as string | undefined
    if (url?.startsWith('https://nuxt.com')) {
      const guide = useGuideStore()

      function onClick(e: MouseEvent) {
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey)
          return
        e.preventDefault()
        guide.openEmbeddedDocs(url!)
      }

      return () => h('a', { ...props, href: url, onClick }, slots)
    }
    else {
      return () => h(NuxtLink, props, slots)
    }
  },
})
