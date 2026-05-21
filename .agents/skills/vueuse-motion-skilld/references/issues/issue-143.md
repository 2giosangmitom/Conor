---
number: 143
title: "Issue with \"visible\" / \"visible-once\" variant"
type: other
state: closed
created: 2023-07-18
url: "https://github.com/vueuse/motion/issues/143"
reactions: 12
comments: 19
---

# Issue with "visible" / "visible-once" variant

**Description:**
When using the Vueuse/Motion library, I have encountered an issue with the "visible" / "visible-once" variant. Normally, the element should be immediately visible when it is within the viewport. However, the problem occurs where the element is only displayed when I scroll over the viewport.

**Steps to reproduce:**

Open the relevant page where the element with the "visible" / "visible-once" variant is used.
Ensure that the viewport directly shows the element without the need for scrolling.
Expected behavior:
The element should be immediately visible when it is within the viewport.

**Current behavior:**
The element is only displayed when scrolling over the viewport. It appears that the "visible" / "visible-once" variant is not functioning as expected.

**Additional information:**

Used version of Vueuse/Motion library: 2.0.0
Browser and version used: Brave [Version 1.52.130] (Chromium)
Operating system: Windows 10

**Notes:**
This issue affects the user experience as the element is not immediately visible when the viewport contains it. It would be desirable for the element to be correctly displayed according to the "visible" / "visible-once" variant, without the need for scrolling.

---

## Top Comments

**@devloos** (+5):

Hey @Rene-Roscher,

I have the same issue, I initially thought it was a user error but it seems like people are also experiencing this.

This issue dates back to September of 2021: https://github.com/vueuse/motion/issues/29

It is unfortunate that it hasn't yet been addressed. It is definitely killing this package for me.

**@rylanharper** (+2):

Hey everyone! I've found a temporary solution for this.. Its not ideal, but it works. Let me first post how this should work if the v-motion module behaved as expected:

**How its suppose to work**

The following animation should work when the item(s) are in the initial viewport view. However, it does not. Here I have an `animation` function I simply pass into my project array (v-for loop) using `v-motion`. 

*Note this only works with `enter`, but not `visible` or `visibleOnce`*
```
const animation = (i) => ({
  initial: {
    y: 30,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      delay: 50 * i
    }
  }
})

// template code
<div v-for="(project, i) in projects" :key="project._id" v-motion="animation(i)">
```...

**@naveeng2402** (+1):

@Tahul I found that this issue is found in chromium based browsers (tested in Google Chrome, Microsoft Edge) but not in Firefox. 