---
number: 108
title: visible-once doesn't work but visibleOnce does (Nuxt 3)
type: other
state: closed
created: 2023-04-06
url: "https://github.com/vueuse/motion/issues/108"
reactions: 4
comments: 0
---

# visible-once doesn't work but visibleOnce does (Nuxt 3)

Just been playing with 2.0.0-beta-27 in Nuxt 3.

This works 
```typescript
v-motion
:initial="{
  opacity: 0,
  y: 100,
}"
:visibleOnce="{
  opacity: 1,
  y: 0,
  transition: {
    delay: 200
  },
}"
``` 

This doesn't 
```typescript
v-motion
:initial="{
  opacity: 0,
  y: 100,
}"
:visible-once="{
  opacity: 1,
  y: 0,
  transition: {
    delay: 200
  },
}"
``` 