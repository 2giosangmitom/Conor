---
number: 101
title: "Use presets animations on variants (eg. :tapped)  "
type: other
state: open
created: 2023-02-08
url: "https://github.com/vueuse/motion/issues/101"
reactions: 4
comments: 0
---

# Use presets animations on variants (eg. :tapped)  

Would be super nice to be able to use for instance: `v-motion-roll-top` on variants event like tapped, hover, ...

It looks like for now preset can only be use for initial / visible, but not on hover, tapped.
Maybe I'm missing something ?

**Suggestions:**

Could be something like :

`<div v-motion :tapped="roll-top" :initial="fade" />`

or:

`<div v-motion-roll-top tapped  initial /> // if you can choose any events when the motion is triggered` 

Cherry on the cake would be then to be able to specify delay for each:

`<div v-motion-roll-top :tapped="{delay:300}"  initial={delay:100} />` 
