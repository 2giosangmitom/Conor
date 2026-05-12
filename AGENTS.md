# AGENTS.md

## Tổng quan dự án

Dự án này sử dụng **Vue.js** làm nền tảng frontend kết hợp với **Nuxt.js** làm framework, và **NuxtUI** làm thư viện component chính.

---

## Quy tắc bắt buộc (Rules)

### ✅ Luôn sử dụng component từ NuxtUI

Tất cả các component UI **phải** được lấy từ thư viện [NuxtUI](https://ui.nuxt.com/). Không được tự viết component từ đầu nếu NuxtUI đã có sẵn component tương đương.

**Ví dụ đúng:**

```vue
<!-- ✅ Dùng UButton từ NuxtUI -->
<UButton label="Đăng nhập" color="primary" />

<!-- ✅ Dùng UInput từ NuxtUI -->
<UInput v-model="email" placeholder="Email của bạn" />

<!-- ✅ Dùng UModal từ NuxtUI -->
<UModal v-model="isOpen">
  <template #content>...</template>
</UModal>
```

**Ví dụ sai:**

```vue
<!-- ❌ Không tự viết button thủ công -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">Đăng nhập</button>

<!-- ❌ Không tự dựng input từ HTML thuần -->
<input type="text" class="border rounded p-2" placeholder="Email của bạn" />
```

---

### ✅ Thứ tự ưu tiên khi chọn component

1. **NuxtUI component** — kiểm tra tại https://ui.nuxt.com/components trước khi làm bất cứ điều gì.
2. **Tùy chỉnh qua `ui` prop hoặc slot** — nếu cần thay đổi giao diện, dùng `ui` prop hoặc slot của NuxtUI thay vì override bằng CSS tùy ý.
3. **Wrap component NuxtUI** — nếu cần component tái sử dụng với config mặc định riêng, hãy wrap component NuxtUI thay vì viết mới hoàn toàn.

```vue
<!-- ✅ Wrap NuxtUI component để tái sử dụng -->
<!-- components/AppButton.vue -->
<template>
  <UButton v-bind="$props" color="primary" size="md" />
</template>
```

---

### ✅ Tùy chỉnh giao diện

Để tùy chỉnh giao diện component NuxtUI, sử dụng theo thứ tự ưu tiên:

1. **`ui` prop** để override class nội bộ của component.
2. **Slot** để inject nội dung tùy chỉnh.
3. **`app.config.ts`** để thiết lập theme mặc định toàn cục.

```vue
<!-- ✅ Dùng ui prop để tùy chỉnh -->
<UButton label="Xác nhận" :ui="{ base: 'font-bold tracking-wide' }" />
```

---

### ❌ Những điều không được làm

| Không được                                                     | Thay bằng                                 |
| -------------------------------------------------------------- | ----------------------------------------- |
| Tự viết component Button, Input, Modal, ... từ đầu             | Dùng `UButton`, `UInput`, `UModal`, ...   |
| Dùng thư viện UI khác (Element Plus, Vuetify, shadcn-vue, ...) | Dùng NuxtUI                               |
| Override style bằng `!important` hoặc CSS inline tùy tiện      | Dùng `ui` prop hoặc `app.config.ts`       |
| Tạo component layout tùy ý (Grid, Container, ...)              | Dùng `UContainer`, Tailwind utility class |

---

## Cấu trúc thư mục khuyến nghị

```
.
├── components/
│   └── app/           # Các wrapper component dựa trên NuxtUI
├── pages/             # Nuxt pages
├── layouts/           # Nuxt layouts (dùng UContainer, v.v.)
├── composables/       # Vue composables
├── app.config.ts      # Cấu hình NuxtUI theme toàn cục
└── nuxt.config.ts     # Cấu hình Nuxt + khai báo module NuxtUI
```

---

## Cấu hình NuxtUI

Đảm bảo `@nuxt/ui` đã được khai báo trong `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
});
```

Để tùy chỉnh theme mặc định:

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

## Tài liệu tham khảo

- [NuxtUI Components](https://ui.nuxt.com/components)
- [NuxtUI Theming](https://ui.nuxt.com/getting-started/theming)
- [Nuxt.js Docs](https://nuxt.com/docs)
- [Vue.js Docs](https://vuejs.org/guide/introduction)
