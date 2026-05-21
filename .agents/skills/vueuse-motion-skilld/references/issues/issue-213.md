---
number: 213
title: Disable bounce (spring) on default presets?
type: other
state: open
created: 2024-07-15
url: "https://github.com/vueuse/motion/issues/213"
reactions: 2
comments: 3
---

# Disable bounce (spring) on default presets?

Hi,

Thank you for creating and maintaining this library!

I'm using this library on vue 3 and noticed that if I use default presets in any way, (e.g. `v-motion-slide-visible-bottom` or  `<Motion preset="slideVisibleBottom">`) it will automatically add spring effect (bouncing at the end of the animation).

However, once I add a custom `duration` value (e.g. `:duration="300"`), the spring effect disappears.

Any way to globally disable the spring effect on default presets?

Thank you.