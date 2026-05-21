---
number: 109
title: Deconstructing `useMotions()` returns `undefined`
type: bug
state: open
created: 2023-04-13
url: "https://github.com/vueuse/motion/issues/109"
reactions: 0
comments: 4
labels: "[bug]"
---

# Deconstructing `useMotions()` returns `undefined`

Following the examples from the docs:
https://motion.vueuse.org/directive-usage.html#access-a-v-motion-instance

```js
<template>
  <div
    v-motion="'custom'"
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0 }"
    :variants="{ custom: { scale: 2 } }"
  />

<button type="button" @click="customEvent">
  Click me
</button>

</template>

<script setup>
import { useMotions } from '@vueuse/motion'

// Get custom controls
const { custom } = useMotions()

const customEvent = () => {
   console.warn(custom)   // <-- Returns undefined
  custom.variant.value = 'custom' // <-- Does not work
}
</script>
```

Note the `custom` from useMotions() is `undefined`

Tested on v. 2.0.0-beta.27



---

## Top Comments

**@BobbieGoede** [maintainer]:

It looks like this is due to the properties on the object returned by `useMotions` being set after `script` is run. As mentioned already, a possible workaround would be not to deconstruct the object. 

I'll mark this a bug since deconstruction is shown as an example in the documentation, will investigate it later!

**@kranachan** (+1):

Same problem, try not to deconstruct it:
`const motions = useMotions()`

**@idflood**:

I recently encoutered the same issue. After adding a few console log (or just randomly?) the useMotion started working again but it was not stable, and after reloading and/or restarting nuxt it broke again.

I got it working again after downgrading nuxt to 3.4.3 and deleting the `.nuxt` folder.