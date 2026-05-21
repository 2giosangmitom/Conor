---
number: 60
title: useSpring example not working
type: bug
state: closed
created: 2022-04-14
url: "https://github.com/vueuse/motion/issues/60"
reactions: 4
comments: 4
labels: "[bug]"
---

# useSpring example not working

Hi,

I've used the useSpring example from the documentation but it doesn't seem to work. Am I missing something or is the documentation incorrect? This is my very simple component. I have globally installed vue motion in my app. 

When I click the div, I see 'click' appear in the console but no animation is triggered. 

I get an error in this codesandbox when triggering the animation that I'm not getting in my local app, I'm not sure if it's related. `Cannot read properties of undefined (reading 'apply')`
https://codesandbox.io/s/vueuse-motion-forked-i76zv6?file=/src/components/Bar.vue


Can anyone shed some light?

```
<template>
  <div ref="target" class="bar" @click="onClick"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useSpring } ...

---

## Top Comments

**@didavid61202** (+1):

@boydenhartog I think the doc might have been changed and us outdated. After looking at [`useSpring`'s implementation](https://github.com/vueuse/motion/blob/01f763fe7040fd56209e150879a1fb3db67bbe9c/src/useSpring.ts#L17), I think you can try using it like this: [stackblitz demo with Nuxt 3](https://stackblitz.com/edit/nuxt-starter-oawxfy?file=plugin%2Fmotion.client.ts,app.vue,nuxt.config.ts)


**@blisst** (+1):

I updated @didavid61202 's great work to use the `reactiveTransform` composable from Vue Motion.  That made a bit more sense to me and I'm guessing that's how the authors of this library intended it to be used?

Basically `reactiveTransform` outputs a `state` variable which `useSpring` can animate, which is then tied to a `transform` reactive variable which can then be bound to the actual element's style.

https://stackblitz.com/edit/nuxt-starter-vujfqb?file=app.vue

**@BobbieGoede** [maintainer]:

Resolved by #181