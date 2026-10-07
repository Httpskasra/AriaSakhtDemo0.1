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
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'rounded-card shadow-premium'
      }
    },
    input: {
      slots: {
        root: 'w-full',
        base: 'rounded-field font-num'
      },
      defaultVariants: {
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
      defaultVariants: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    select: {
      slots: {
        base: 'rounded-field font-num'
      },
      defaultVariants: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    selectMenu: {
      slots: {
        base: 'rounded-field font-num'
      },
      defaultVariants: {
        size: 'lg',
        color: 'primary',
        variant: 'outline'
      }
    },
    toast: {
      slots: {
        root: 'tejaris-toast',
        wrapper: 'tejaris-toast__content',
        title: 'tejaris-toast__title',
        description: 'tejaris-toast__description',
        actions: 'tejaris-toast__actions',
        close: 'tejaris-toast__close',
        progress: 'tejaris-toast__progress'
      }
    },
    toaster: {
      slots: {
        viewport: 'tejaris-toaster__viewport',
        base: 'tejaris-toaster__base'
      }
    },
    formField: {
      slots: {
        label: 'text-sm font-semibold text-primary'
      }
    },
    modal: {
      slots: {
        content: 'rounded-dialog'
      }
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
