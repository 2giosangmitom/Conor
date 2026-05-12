# PROJECT_RULES.md

# Existing Project Structure

```txt id="i9t1nd"
app/
├── assets/
│   └── css/
│       └── main.css
│
├── layouts/
│   ├── auth.vue
│   └── default.vue
│
├── pages/
│   ├── (auth)/
│   │   ├── signin.vue
│   │   └── signup.vue
│   │
│   └── index.vue
│
├── utils/
│   └── auth.ts
│
└── app.vue
```

# File Modification Rules

## Allowed

AI may:

- create landing page components
- update index.vue
- create reusable sections

## Forbidden

AI must NOT:

- modify auth.vue
- modify signin.vue
- modify signup.vue
- modify utils/auth.ts
- remove layouts
- rename files
- change routing structure

---

# Routing Rules

Sign In:

- `/signin`

Sign Up:

- `/signup`

Use:

- NuxtLink

---

# Framework Rules

Use:

- Nuxt 3
- Vue 3 Composition API
- Nuxt UI
- TailwindCSS

---

# Styling Rules

Prefer:

- Nuxt UI variants
- Tailwind utilities

Avoid:

- large custom CSS systems
- random inline styles
