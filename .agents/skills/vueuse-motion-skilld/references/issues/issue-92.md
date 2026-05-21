---
number: 92
title: Compatibility Issue on Nuxt 3
type: other
state: closed
created: 2022-11-16
url: "https://github.com/vueuse/motion/issues/92"
reactions: 10
comments: 11
---

# Compatibility Issue on Nuxt 3

Hi there,
I'm having troubles using the latest version of the vueuse/motion with nuxt 3 when I follow the the Doc about Nuxt Usage.
If you pass the:
`'@vueuse/motion/nuxt'`
The error returned is about: Cannot start nuxt:  Package subpath './nuxt' is not defined by "exports" in...

I tried a few thing, but not solve my problem: I tried to change the version of beta.12 to beta.23 and I removed too the /nuxt on nuxt.config.ts. The error changed, but still there.

Nuxt 3.0.0-rc.13 @vueuse/motion": "^2.0.0-beta.12 

Does have someone with the same problem and found  a solution?



---

## Top Comments

**@itzaks** (+49):

> Anyone have it working in nuxt3 yet?

Seems like there was an unannounced release of `beta-25` that you can use now!

`"@vueuse/motion": "2.0.0-beta.25",`

Works fine with nuxt 3.0. 

**@antfu** [maintainer] (+4):

/cc @Tahul

**@grunghi** (+6):

Problem might be in the deprecated `addAutoImportDir` function used in the nuxt module, it should be replaced with `addImportsDir`.

Also the  `publicRuntimeConfig` option used in the module is no longer present in nuxt 3, as it was replaced with `runtimeConfig.public`. 

I've made a patch to fix the compatibility of  @vueuse/motion beta.24 with nuxt 3.0.0 stable release, you can find it here and apply it with yarn patch-package.