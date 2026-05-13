export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
    },
    accordion: {
      slots: {
        item: 'border-b border-default last:border-b-0',
      },
    },
  },
})
