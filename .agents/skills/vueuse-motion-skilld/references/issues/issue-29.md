---
number: 29
title: Could we make *-visible directives work when the element is visible from the start?
type: other
state: closed
created: 2021-09-01
url: "https://github.com/vueuse/motion/issues/29"
reactions: 10
comments: 12
---

# Could we make *-visible directives work when the element is visible from the start?

Hello,

As said in the title, In some cases, when doing responsive landing page design (e.g. 15" laptop screen vs 4k screen), it's not really possible to predict 100% of the time when an element will be visible on the first load.

In the cases when a `*-visible` directive is visible on the first load, the animation never trigger making the element invisible.

I made a repo to illustrate: https://github.com/xstevenyung/v-motion-visible-issue

I could work on a PR if this is something that make sense to change.

Cheers and thanks for your work !

---

## Top Comments

**@Tahul** [maintainer] (+1):

Hey Steven, thank you for your issue!

That seem like great idea!

I would happily review any PR that you submit, please let me know if you need anything concerning the code itself.  

**@robinvoor**:

I have the same issue, some elements are already in the viewport at page load, but not visible initially. Only after scrolling down and back up to those elements will become visible. Is a solution being worked on or does this not have a priority?

**@JonHerbert**:

Same issue, thanks!