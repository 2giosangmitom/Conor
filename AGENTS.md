# AGENTS.md

YouTube dictation/practice app — transcribe videos, let users practice typing along.

**Stack:** Nuxt 4 · Nuxt UI 4 · TailwindCSS v4 · pnpm · TypeScript

---

## Commands

```bash
pnpm install          # deps + nuxt prepare (postinstall)
pnpm dev              # dev server
pnpm build            # production build
pnpm generate         # static output
pnpm preview          # preview production build

pnpm lint && pnpm lint:fix   # ESLint
pnpm fmt:check && pnpm fmt:fix  # oxfmt formatter
pnpm typecheck        # nuxt typecheck
pnpm test             # vitest run (all projects)
```

**CI order (Node 25, pnpm 10):** `typecheck → lint → fmt:check → test`

---

## Architecture

```
app/            — Vue pages, components, layouts, assets
server/
  api/          — API routes (auth/, video/, practice/, workflow/)
  db/           — Drizzle schema + migrations (PostgreSQL via NuxtHub/Neon)
  utils/        — Server utilities (auth.ts, youtube.ts)
  workflows/    — Vercel Workflow SDK (video-indexing/)
shared/
  types/        — Shared TypeScript types
  utils/        — Shared logic (client + server)
test/unit/      — Vitest unit tests (node environment)
```

- **Entry point:** `app/app.vue` wraps `<UApp>` + `<NuxtLayout>` + `<NuxtPage>`
- **Primary language:** Vietnamese (`htmlAttrs: { lang: "vi" }`)
- **Two layouts:** `default.vue` and `practice.vue`

---

## Auth (Better Auth)

- Google OAuth only — email/password is **disabled** (`emailAndPassword.enabled: false`)
- Drizzle adapter → PostgreSQL (Neon HTTP driver via NuxtHub)
- Rate limiting via NuxtHub KV (`secondaryStorage`)
- Auth catch-all route: `server/api/auth/[...all].ts`
- **Protected routes:** use `defineProtectedEventHandler()` from `server/utils/auth.ts` — it validates session and injects `session.user` into the handler
- Client-side: use Better Auth Vue client (auto-imported from `~/lib/auth-client` or similar)

**Required env vars** (see `.env.example`): `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## Database (Drizzle ORM)

- Schema: `server/db/schema/schema.ts` + `auth-schema.ts`
- Migrations: `server/db/migrations/`
- Applied during build in production (`applyMigrationsDuringBuild: true` when `NODE_ENV=production`)
- Tables: `video`, `video_transcript_sentence`, `practice_session`, `practice_attempt`, `word_mistake`
- Access via `@nuxthub/db` — import as `import { db, schema } from "@nuxthub/db"`

---

## Key Patterns

- **Composables:** `use*` prefix, place in `app/composables/` (create dir if needed)
- **Server-only code** in `server/` — never import in client components
- **Shared logic** in `shared/utils/` — runs on both client and server
- **Data fetching:** `useFetch`/`useAsyncData` in pages, `$fetch` in handlers/server routes
- **State:** `useState` for SSR-safe shared state

---

## Rules

1. **Never install new dependencies** without explicit approval. Prefer built-in Nuxt/Nuxt UI features.
2. **TypeScript always** — no `any`; use interfaces or `unknown`.
3. **Do not modify** `nuxt.config.ts`, `tailwind.config.ts`, or `package.json` unless the task requires it.
4. **Composition API with `<script setup lang="ts">`** only — never Options API.
5. **Use auto-imports** — do not manually import `ref`, `computed`, `useRoute`, etc.
6. **Always use Nuxt UI components** for UI elements. No custom buttons/inputs/modals.
7. **TailwindCSS utility classes** only — no scoped `<style>` unless overriding third-party.
8. **No hardcoded hex colors** — use CSS variables and Tailwind tokens.
9. **Run `pnpm lint`, `pnpm fmt:check`, `pnpm typecheck`** before marking tasks complete.
10. **Tests** go in `test/unit/*.test.ts`. Run with `pnpm test`.
