---
number: 142
title: How do you animate on leave/exit?
type: other
state: open
created: 2023-07-17
url: "https://github.com/vueuse/motion/issues/142"
reactions: 3
comments: 6
---

# How do you animate on leave/exit?

I don't see any mentions in the documentation. Is this possible to do? 

---

## Top Comments

**@alexrichardsweb** (+1):

Same here. Can't get any form of `leave` transition working. There is a link to an example demo in the docs but not example code (from what I can see).

I have found other examples but this is the only one using composition API https://codesandbox.io/s/vueuse-motion-playground-forked-61xpz?file=/src/components/Modal.vue:122-176 - I have replicated this but in a Nuxt 3 project, is there anything else required on top of the above example to get `leave` animations working with Nuxt 3?

**@gazreyn**:

Also been having issues trying to get it to work and what I have isn't perfect but it's just some observations I have.

- The element you're trying to animate in/out have to be wrapped in a <Transition> element
- I found that I had to both account for both `@enter` and `@leave` events on the transition
- The :leave property never seemed to register, so I basically had the following

```
<script setup lang="ts">
const myElement = ref<HTMLElement>();
const { leave, apply } = useMotion(lowerthird);

async function onEnter(_: HTMLElement, done: () => void) {
  await apply({
    y: 0,
    opacity: 1,
  });
  done();
}

async function onLeave(_: HTMLElement, done: () => void) {
  await apply({
    y: 100,
    opacity: 0,
  });
  leave(done);
}
</script>

<template>
  <Transition @enter="onEnter" @leave="onLeave">
    <div ref="myElement" v-if="isVisible" v-motion...></div>
  </Transition>
</template>
```...

**@sneakylenny**:

Couldn't find it either, I expected it to work with `v-if` or `v-show` but `v-show` doesn't do anything at all and `v-if` only shows the enter animation.

I tried to replicate the demo and apply the animation manually, but without success. Somehow I get the same result: only the enter animation works.

I guess I'm switching back to https://github.com/oku-ui/motion though it's not as well maintained as this one, it does have working and easy to apply leave anim...