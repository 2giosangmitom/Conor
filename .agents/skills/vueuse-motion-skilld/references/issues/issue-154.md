---
number: 154
title: visible-once / visibleOnce Documentation (Directive Usage)
type: other
state: closed
created: 2023-10-25
url: "https://github.com/vueuse/motion/issues/154"
reactions: 4
comments: 2
---

# visible-once / visibleOnce Documentation (Directive Usage)

I had the problem that the element that i applied `:visible-once="…` to was not animating (Directive Usage). After reading some Issues here i tried to write `:visibleOnce="…` and it **worked**!

In the Docs it only states the kebab-case (visible-once). Is the camel-case the correct Version? If so I think it needs to be updated in the Docs. 

---

## Top Comments

**@BobbieGoede** [maintainer]:

The kebab-case usage has been fixed by #141 (but not published in a release yet), I think the pascalCase usage doesn't have to be documented (after fix release) as using kebab-case is in line with html attribute convention (see Vue docs on prop name casing).

**@brambekkers**:

Thanks for your comment. My eslint is always complaining about this not being hyphenated. Is there a possibility to make it work with visible-once?