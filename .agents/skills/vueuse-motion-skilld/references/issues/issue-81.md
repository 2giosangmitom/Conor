---
number: 81
title: Notes about v2
type: other
state: open
created: 2022-09-11
url: "https://github.com/vueuse/motion/issues/81"
reactions: 10
comments: 0
---

# Notes about v2

Hello everyone;

I am opening this issue to track the progress of v2 release and giving some updates about this package situation.

I have to say maintaining this project while working full-time in a company (NuxtLabs) has been very hard.

Considering the fact that the Vue **3** ecosystem has been growing really, really fast since I started this project, there has been a lot of work between each sessions on the package that has been dedicated solely to upgrading dependencies and ensuring the build was passing properly on latest versions.

Now that things are stabilizing a bit more (Nuxt 3 stable release, Vue 3.3...), you can be sure I'll be dedicating more time to this package and its wellbeing.

I am very grateful for all the feedbacks you are giving me through issue, and would be even more if you could add reproductions to the ones that are missing it!

---

### V2 Infos 

v2 will include these new features:

-  `<Motion>` component (#75 wip)
-  Full SSR support (on `<Motion />` and `v-motion`) (#75 wip)
-  Better documentation with more examples (#75 wip)
-  Improved test suite and repository structure (#75)
-  `@nuxt/content` MDC support (#75 wip)
-  Reshaped `variants` system
-  Reshaped `useMotion`
-  Better tree-shaking and lowered bundle size
-  Proper release cycle
-  Improved TypeScript support
-  Removing Vue 2 support (#75)

I will be **removing Vue 2 support** in the 2.0 version.

I know this is a hard choice, but achieving full SSR/SSG support on both versions is currently almost impossible to me, or would introduce a **LOT** of complexities in the process.

I will be pushing a last release of the current 1.x version of @vueuse/motion, and keep it on a tag in case emergency fixes has to be applied.

That will be the last release supporting Vue 2, which I would like to include as many fixes as I can for this version, I'm so asking for the Vue 2 users o...