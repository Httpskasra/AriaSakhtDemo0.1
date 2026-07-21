export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    button: {
      rounded: 'rounded-brand',
      default: {
        size: 'md',
        color: 'primary'
      }
    },
    card: {
      rounded: 'rounded-brand',
      shadow: 'shadow-premium'
    },
    input: {
      rounded: 'rounded-brand'
    },
    modal: {
      rounded: 'rounded-brand'
    },
    icons: {
      search: 'i-lucide-search',
      cart: 'i-lucide-shopping-cart',
      user: 'i-lucide-user',
      chevronDown: 'i-lucide-chevron-down',
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right'
    }
  }
})
