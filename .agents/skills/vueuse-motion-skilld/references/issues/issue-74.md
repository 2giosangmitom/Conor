---
number: 74
title: add delay to presets animation
type: other
state: closed
created: 2022-07-13
url: "https://github.com/vueuse/motion/issues/74"
reactions: 16
comments: 4
---

# add delay to presets animation

Is there a way to add delay to the preset animation ? The doc didn't mention this, if you plan to add this in the future, I think this syntax would look good:
`<div v-motion-slide-right  :delay="500" />`
The feature I wanted to add to my app is to `v-for` loop through an array and give each item a different `delay` based on their index, if this is possible with the current version please let me know how, thanks

---

## Top Comments

**@kevinlaw91** (+2):

Adding `:duration` would be helpful too

**@kalnode**:

Re: your specific concern

> The feature I wanted to add to my app is to `v-for` loop through an array and give each item a different `delay` based on their index, if this is possible with the current version please let me know how, thanks

This is essentially staggered animation, and although the way you describe may be possible with a convenient preset-adjustment as we're all talking about, I think that staggered-anim is still better served by using custom motions triggered by Vue animation hooks, all wrapped in a `<TransitionGroup>`. This is exactly what I've done using this library for...

**@innocenzi**:

I think this should be considered a bug, it's very confusing that the `:delay` is applied to all motion directives within a `v-for` and not to individual elements:

```vue
<div v-for="i in 5" :key="i">
	<div
		v-motion-slide-visible-left
		:delay="100 * i"
	/>
</div>
```