---
number: 148
title: useSpring not working
type: bug
state: closed
created: 2023-09-08
url: "https://github.com/vueuse/motion/issues/148"
reactions: 3
comments: 0
labels: "[bug]"
---

# useSpring not working

Hello,
It seems like `useSpring` is not working. Or at least, not working like the documentation is describing it. Is it up to date?

Check this minimal setup: https://stackblitz.com/edit/github-2k6bjv?file=nuxt.config.ts,app.vue

Also, it's not visible in stackblitz but on my vscode, this very code is screaming like never regarding typings (which I only get if I import explicitly `@vueuse/motion` in the .vue component, otherwise the function is not typed).



After some digging in the source code, I understand the v2 expects more something like this (no typescript error this way):
```js
const box = ref<HTMLElement>()
const scale = ref(0)
const spring = useSpring({ scale: scale.value }, { target: box })

function scaleUp() {
  spring.set({ scale: 2 })
}
```...