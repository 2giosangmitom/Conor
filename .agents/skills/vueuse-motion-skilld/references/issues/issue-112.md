---
number: 112
title: nuxt warning
type: other
state: closed
created: 2023-04-17
url: "https://github.com/vueuse/motion/issues/112"
reactions: 17
comments: 5
---

# nuxt warning

with the latest nuxt `3.4.1` there is a warning on the app

[nuxt] [runtimeConfig] You are trying to access a public runtime config value (`motion`) directly from the top level. This currently works (for backward compatibility with Nuxt 2) but this compatibility layer will be removed in v3.5. Instead, you can update `config['motion']` to `config.public['motion']`.
g


---

## Top Comments

**@alex-eliot** [maintainer] (+1):

I've made a PR that fixes this: https://github.com/vueuse/motion/pull/111

**@leopoldkristjansson** (+2):

Was seeing the same message but with 'content' instead of 'motion' using Nuxt 3.3.2. It seems to be gone after upgrading to Nuxt 3.5.1

**@msfm360**:

same 