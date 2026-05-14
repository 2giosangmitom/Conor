# AGENTS.md

This document provides project context and contribution guidelines for AI agents and human developers. All contributors **must** follow the rules outlined here to ensure consistency and quality.

---

## Project Overview

A modern YouTube dictation application that transcribes YouTube videos in real-time.

**Stack:**

- **Framework:** Nuxt 4
- **UI:** NuxtUI 4
- **Styling:** TailwindCSS v4
- **Package Manager:** pnpm

---

## Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint the codebase
pnpm lint

# Check formatting
pnpm fmt:check

# Format the codebase
pnpm fmt
```

---

## Rules

### General

1. **Never install new dependencies** without explicit user approval. Prefer built-in Nuxt/NuxtUI features first.
2. **Prefer TypeScript** for all new files. Avoid `any` types — use proper interfaces or `unknown`.
3. **Do not modify** `nuxt.config.ts`, `tailwind.config.ts`, or `package.json` unless the task explicitly requires it.

### Vue & Nuxt Conventions

4. Use the **Composition API with `<script setup lang="ts">`** for all components. Never use Options API.
5. Use **auto-imports** — do not manually import `ref`, `computed`, `useRoute`, etc. Nuxt handles this automatically.
6. Name composables with the `use` prefix (e.g., `useTranscription.ts`) and place them in `app/composables/`.
7. Place **server-only logic** in `server/` (API routes, DB calls). Never import server utilities in client components.
8. Use `shared/utils/` for logic that runs on both client and server.
9. Prefer `useFetch` or `useAsyncData` for data fetching in pages; use `$fetch` inside event handlers and server routes.

### UI & Styling

10. **Always use NuxtUI components** for UI elements (buttons, inputs, modals, etc.). Do not create custom alternatives to components already in NuxtUI.
11. Style with **TailwindCSS utility classes**. Avoid scoped `<style>` blocks unless necessary for complex animations or third-party overrides.
12. Use **CSS variables and Tailwind tokens** for colors/spacing — no hardcoded hex values in templates.
13. Ensure all interactive elements are **keyboard accessible** and include appropriate ARIA attributes.

### Code Quality

14. Run `pnpm lint` and `pnpm fmt:check` before considering any task complete. Fix all errors — do not suppress them.
15. Keep components **focused and small**. Extract reusable logic into composables and reusable UI into components.
16. Write **self-documenting code**. Add JSDoc comments only for non-obvious functions or public composable APIs.
