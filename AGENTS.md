# AGENTS.md

This document provides project context and contribution guidelines for AI agents and human developers. All contributors must follow the rules outlined here to ensure consistency and quality.

---

## Project Overview

A modern YouTube dictation application that transcribes YouTube videos in real-time.

**Stack:**

- **Framework:** Nuxt 4
- **UI:** Nuxt UI 4
- **Styling:** TailwindCSS v4
- **Package Manager:** pnpm

---

## Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Generate static output
pnpm generate

# Preview production build
pnpm preview

# Lint the codebase
pnpm lint

# Fix lint issues
pnpm lint:fix

# Check formatting
pnpm fmt:check

# Format the codebase
pnpm fmt:fix

# Typecheck
pnpm typecheck

# Run tests
pnpm test
```

---

## Rules

### General

1. **Never install new dependencies** without explicit user approval. Prefer built-in Nuxt and Nuxt UI features first.
2. **Prefer TypeScript** for all new files. Avoid `any` types; use proper interfaces or `unknown`.
3. **Do not modify** `nuxt.config.ts`, `tailwind.config.ts`, or `package.json` unless the task explicitly requires it.

### Vue and Nuxt Conventions (aligned with Vue and Nuxt skills)

4. Use the **Composition API with `<script setup lang="ts">`** for all components. Never use Options API.
5. Use **auto-imports** for Vue and Nuxt composables; do not manually import `ref`, `computed`, `useRoute`, etc.
6. Use script setup macros (`defineProps`, `defineEmits`, `defineModel`, `defineExpose`, `defineOptions`, `defineSlots`) with explicit types.
7. Avoid reactive props destructuring; access props via `props` or `toRefs`.
8. Prefer `shallowRef` over `ref` when deep reactivity is not required.
9. Name composables with the `use` prefix (for example `useTranscription.ts`) and place them in `app/composables/`.
10. Place **server-only logic** in `server/` (API routes, DB calls). Never import server utilities in client components.
11. Use `shared/utils/` for logic that runs on both client and server.
12. Prefer `useFetch` or `useAsyncData` for data fetching in pages; use `$fetch` inside event handlers and server routes.
13. Use Nuxt built-in components (`NuxtLink`, `NuxtPage`, `NuxtLayout`, `ClientOnly`) and Vue built-ins (`Transition`, `Teleport`, `Suspense`, `KeepAlive`) when appropriate.
14. Use `useState` for SSR-safe shared state when state must persist across requests.

### UI and Styling

15. **Always use Nuxt UI components** for UI elements (buttons, inputs, modals, etc.). Do not create custom alternatives to components already in Nuxt UI.
16. Style with **TailwindCSS utility classes**. Avoid scoped `<style>` blocks unless necessary for complex animations or third-party overrides.
17. Use **CSS variables and Tailwind tokens** for colors and spacing; no hardcoded hex values in templates.
18. Ensure all interactive elements are **keyboard accessible** and include appropriate ARIA attributes.

### Code Quality

19. Run `pnpm lint`, `pnpm fmt:check`, and `pnpm typecheck` before considering any task complete. Fix all errors; do not suppress them.
20. Keep components **focused and small**. Extract reusable logic into composables and reusable UI into components.
21. Write **self-documenting code**. Add JSDoc comments only for non-obvious functions or public composable APIs.
22. Use `pnpm lint:fix` and `pnpm fmt:fix` to remediate issues when possible.
23. Write **unit tests** for all new composables and critical components. Place tests in `tests/unit/` with clear naming.
24. Run tests with `pnpm test` and ensure all tests pass before marking a task as complete.
