# ROUTING.md

# Current Routing Structure

## Existing Pages

```txt id="q8d14y"
/
-> Landing Page

/signin
-> Sign In Page

/signup
-> Sign Up Page
```

---

# Important Rules

DO NOT:

- change route names
- create unnecessary routes
- modify auth routes
- create nested auth systems

---

# Navigation Rules

Navbar buttons:

Sign In:

```vue id="gxrb70"
<NuxtLink to="/signin">
```

Sign Up:

```vue id="cgt0e1"
<NuxtLink to="/signup">
```

---

# Landing Page Rules

Landing page entry:

```txt id="v83r0u"
app/pages/index.vue
```

This file should remain clean.

Recommended:

```vue id="ttzv92"
<template>
  <LandingPage />
</template>
```

---

# Future Planned Pages

These pages may exist later:

- Listening Practice Page
- Account Page
- Leaderboard Page

But DO NOT generate them now.

Current scope:
Landing Page ONLY.
