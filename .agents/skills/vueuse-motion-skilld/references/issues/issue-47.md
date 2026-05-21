---
number: 47
title: Could not resolve `@vueuse/shared` on `2.0.0-beta.9`
type: other
state: closed
created: 2022-01-25
url: "https://github.com/vueuse/motion/issues/47"
reactions: 3
comments: 4
---

# Could not resolve `@vueuse/shared` on `2.0.0-beta.9`

Trying to replicate the pinch example from `@vueuse/gesture` I found that after installing the lib with `npm i @vueuse/motion`, `vite` started to fail showing a `Could not resolve "@vueuse/shared"` error message


#### `npm run dev`
...

---

## Top Comments

**@Tahul** [maintainer] (+1):

Hello :)

I couldn't reproduce the problem on my end, but found some spots that could be faulty in the package config!

I pushed some changes that should solve both of your errors, @salazarr-js and @hopkins385.

I tried the package there:
https://github.com/Tahul/vueuse-motion-test

As I have a working reproduction, I am closing this issue, but feel free to reopen and tell me if anything breaks for you!

Thanks a lot for your issue and comments! 

**@Of3lia**:

it seems I fixed it by running `npm install @vueuse/shared`
Before that I also runned `npm install -g @vueuse/shared@6.8.0 vue@3.2.21` but idk if that had any impact.

https://github.com/slidevjs/slidev/issues/410#issuecomment-991840810

**@hopkins385**:

Same here, using Vite + Vue 3 + Typescript. `npm i @vueuse/shared` solved the issue for dev-build but keeps throwing errors for the production-build `npm run build` . 

```
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview --host"
  },

```
package list

```
├── @headlessui/vue@1.5.0
├── @types/node@17.0.21
├── @vitejs/plugin-vue@2.2.4
├── @vueuse/components@7.7.1
├── @vueuse/core@7.7.1
├── @vueuse/motion@2.0.0-beta.9
├── @vueuse/shared@8.0.0
├── autoprefixer@10.4.2
├── bootstrap-icons-vue@0.8.0
├── pinia@2.0.11
├── postcss@8.4.8
├── sass@1.49.9
├── tailwindcss@3.0.23
├── typescript@4.6.2
├── vite@2.8.6
├── vue-router@4.0.14
├── vue-tsc@0.29.8
└── vue@3.2.31
```...