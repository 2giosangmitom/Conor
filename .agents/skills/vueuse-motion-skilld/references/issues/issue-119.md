---
number: 119
title: runtime config needs update to be compatible with newer nuxt versions
type: other
state: closed
created: 2023-05-10
url: "https://github.com/vueuse/motion/issues/119"
reactions: 7
comments: 0
---

# runtime config needs update to be compatible with newer nuxt versions

[nuxt] [runtimeConfig] You are trying to access a public runtime config value (motion) directly from the top level. This currently works (for backward compatibility with Nuxt 2) but this compatibility layer will be removed in v3.5. Instead, you can update config['motion'] to config.public['motion'].