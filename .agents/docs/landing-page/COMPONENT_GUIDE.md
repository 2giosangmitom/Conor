# COMPONENT_GUIDE.md

# Landing Page Component Structure

```txt id="5z8nqw"
app/
├── components/
│   ├── landing/
│   │   ├── LandingPage.vue
│   │   ├── LandingHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── SocialProof.vue
│   │   ├── TrendingVideos.vue
│   │   ├── FeaturesSection.vue
│   │   ├── HowItWorks.vue
│   │   ├── FAQSection.vue
│   │   ├── CTASection.vue
│   │   └── LandingFooter.vue
```

---

# Component Responsibilities

## LandingPage.vue

Main landing page composition.

Responsibilities:

- assemble all sections
- control page flow
- maintain section order

Should NOT:

- contain large UI blocks
- contain repeated markup

---

## LandingHeader.vue

Sticky navigation bar.

Use:

- UNavigationMenu
- UButton
- USlideover

Contains:

- logo
- navigation
- sign in/up buttons
- mobile menu

---

## HeroSection.vue

Main hero area.

Contains:

- heading
- subtitle
- CTA
- YouTube input
- floating mockup

This is the most visually important section.

---

## SocialProof.vue

Statistics section.

Contains:

- user stats
- learner avatars
- trust indicators

---

## TrendingVideos.vue

Trending learning videos.

Use:

- UCarousel
- UCard
- UBadge

Each card:

- thumbnail
- title
- level
- duration
- learner count

---

## FeaturesSection.vue

Feature grid section.

Use:

- UPageGrid
- UPageCard

Contains:

- icon
- title
- description

---

## HowItWorks.vue

4-step explanation section.

Desktop:

- horizontal layout

Mobile:

- vertical layout

---

## FAQSection.vue

FAQ accordion section.

Use ONLY:

- UAccordion

---

## CTASection.vue

Final call-to-action section.

Contains:

- heading
- URL input
- CTA button

---

## LandingFooter.vue

Footer section.

Contains:

- links
- copyright
- social icons

---

# Component Rules

Components should:

- remain focused
- avoid excessive props
- avoid unnecessary emits
- stay reusable
- stay readable

Avoid:

- giant components
- duplicated UI
- deeply nested logic
