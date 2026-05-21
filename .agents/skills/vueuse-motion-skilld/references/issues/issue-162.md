---
number: 162
title: Nuxt 3 custom directive error.
type: other
state: closed
created: 2023-12-14
url: "https://github.com/vueuse/motion/issues/162"
reactions: 2
comments: 2
---

# Nuxt 3 custom directive error.

When is define a custom directive in nuxt.config.ts:
```ts
runtimeConfig: {
    public: {
      motion: {
        directives: {
          'default-button': {
            initial: {
              scale: 1,
            },
            hovered: {
              scale: 1,   // This is set because the initial state doesnt work on tapped variant (Issue #63 )
            },
            tapped: {
              scale: 0.97,
            },
          },
          'pop-bottom': {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100,
            },
            visible: {
              scale: 1,
              opacity: 1,
              y: 0,
            },
          },
        },
      },
    },
  },```

And when i now use the Direc...