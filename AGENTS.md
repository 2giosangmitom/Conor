# AGENTS.md

## Project Overview

This project uses **Vue.js** as the frontend foundation combined with **Nuxt.js** as the framework, and **NuxtUI** as the primary UI component library.

---

## Mandatory Rules

### ✅ Always use components from NuxtUI

All UI components **must** come from the [NuxtUI](https://ui.nuxt.com/) library. Do not write custom components from scratch if NuxtUI already provides an equivalent.

**Correct:**

```vue
<!-- ✅ Use UButton from NuxtUI -->
<UButton label="Login" color="primary" />

<!-- ✅ Use UInput from NuxtUI -->
<UInput v-model="email" placeholder="Your email" />

<!-- ✅ Use UModal from NuxtUI -->
<UModal v-model="isOpen">
  <template #content>...</template>
</UModal>
```

**Wrong:**

```vue
<!-- ❌ Do not write a button manually -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>

<!-- ❌ Do not build an input from raw HTML -->
<input type="text" class="border rounded p-2" placeholder="Your email" />
```

---

### ✅ Component selection priority

Before writing any UI code, always check https://ui.nuxt.com/components first. Follow this priority order:

1. **NuxtUI component** — use it directly if it covers your use case.
2. **Customize via `ui` prop or slots** — if the default appearance needs adjustment, use NuxtUI's `ui` prop or named slots instead of arbitrary CSS overrides.
3. **Wrap a NuxtUI component** — if you need a reusable component with custom default config, wrap a NuxtUI component rather than building one from scratch.

```vue
<!-- ✅ Wrap a NuxtUI component for reuse -->
<!-- components/AppButton.vue -->
<template>
  <UButton v-bind="$props" color="primary" size="md" />
</template>
```

---

### ✅ Customizing component appearance

When NuxtUI components need visual customization, follow this priority order:

1. **`ui` prop** — override internal classes of the component.
2. **Slots** — inject custom content into the component.
3. **`app.config.ts`** — set global default theme settings.

```vue
<!-- ✅ Use the ui prop to customize -->
<UButton label="Confirm" :ui="{ base: 'font-bold tracking-wide' }" />
```

---

### ❌ What NOT to do

| Forbidden                                                         | Use instead                             |
| ----------------------------------------------------------------- | --------------------------------------- |
| Writing Button, Input, Modal, etc. from scratch                   | `UButton`, `UInput`, `UModal`, ...      |
| Using other UI libraries (Element Plus, Vuetify, shadcn-vue, ...) | NuxtUI                                  |
| Overriding styles with `!important` or arbitrary inline CSS       | `ui` prop or `app.config.ts`            |
| Building custom layout components (Grid, Container, ...)          | `UContainer` + Tailwind utility classes |

---

## Recommended Directory Structure

```
.
├── components/
│   └── app/           # NuxtUI-based wrapper components
├── pages/             # Nuxt pages
├── layouts/           # Nuxt layouts (using UContainer, etc.)
├── composables/       # Vue composables
├── app.config.ts      # Global NuxtUI theme configuration
└── nuxt.config.ts     # Nuxt config + NuxtUI module registration
```

---

## NuxtUI Setup

Ensure `@nuxt/ui` is registered in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
});
```

To customize the default theme globally:

```ts
// app.config.ts
export default defineAppConfig({
  ui: {
    button: {
      default: {
        color: "primary",
        size: "md",
      },
    },
  },
});
```

---

## References

- [NuxtUI Components](https://ui.nuxt.com/components)
- [NuxtUI Theming](https://ui.nuxt.com/getting-started/theming)
- [Nuxt.js Docs](https://nuxt.com/docs)
- [Vue.js Docs](https://vuejs.org/guide/introduction)
