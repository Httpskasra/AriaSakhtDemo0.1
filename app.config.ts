export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'rounded-brand font-bold justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      },
      variants: {
        size: {
          xs: { base: 'px-2 py-1 text-xs gap-1' },
          sm: { base: 'px-3 py-1.5 text-xs gap-1.5' },
          md: { base: 'px-4 py-2 text-sm gap-1.5' },
          lg: { base: 'px-5 py-2.5 text-sm gap-2' },
          xl: { base: 'px-8 py-3 text-base gap-2' }
        }
      },
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      rounded: 'rounded-card',
      shadow: 'shadow-premium'
    },
    input: {
      slots: {
        root: 'w-full',
        base: 'rounded-field font-num'
      },
      default: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    textarea: {
      slots: {
        root: 'w-full',
        base: 'rounded-field font-num'
      },
      default: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    select: {
      slots: {
        base: 'rounded-field font-num'
      },
      default: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    selectMenu: {
      slots: {
        base: 'rounded-field font-num'
      },
      default: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    formField: {
      slots: {
        label: 'text-sm font-semibold text-primary'
      }
    },
    modal: {
      rounded: 'rounded-dialog'
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
