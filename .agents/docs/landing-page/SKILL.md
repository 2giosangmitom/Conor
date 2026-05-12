# SKILL.md

# AI Coding Behavior Guide

This file defines how AI assistants should work inside this project.

---

# Core Philosophy

This project prioritizes:

- clean architecture
- maintainability
- readability
- Nuxt UI first
- responsive design
- premium SaaS UI

---

# IMPORTANT RULES

## Use Nuxt UI First

Always use:

- UButton
- UCard
- UInput
- UAccordion
- UCarousel
- UContainer
- UPageCard
- UPageGrid

DO NOT manually rebuild existing UI primitives.

---

# Avoid Overengineering

DO NOT:

- create unnecessary abstractions
- generate large architecture systems
- create unnecessary composables
- create unnecessary stores
- create unnecessary plugins

Keep the code simple.

---

# Component Philosophy

Components should:

- be reusable
- be readable
- have single responsibility
- avoid excessive props

---

# Tailwind Usage

Use Tailwind mainly for:

- spacing
- layout
- responsiveness

Avoid giant utility chains when unnecessary.

---

# UI Philosophy

The UI should feel:

- premium
- calm
- spacious
- modern
- productivity-focused

Avoid:

- flashy gradients
- childish UI
- overly colorful interfaces

---

# Layout Philosophy

Always respect:

- provided layout references
- section hierarchy
- spacing rhythm
- responsive behavior

Do NOT redesign sections unless explicitly requested.

---

# Animation Rules

Allowed:

- fade-in
- hover lift
- smooth transitions
- subtle glow

Avoid:

- excessive motion
- complex animations
- distracting effects

---

# Code Style

Use:

- Composition API
- clean naming
- readable structure
- reusable sections

Avoid:

- deeply nested components
- giant files
- duplicated code
