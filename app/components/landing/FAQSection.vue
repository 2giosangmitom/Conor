<template>
  <section id="faq" class="py-20" style="background: #f8f2fa">
    <UContainer :ui="{ base: 'max-w-3xl' }">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2
          class="text-3xl font-semibold mb-3"
          style="font-family: &quot;Plus Jakarta Sans&quot;, sans-serif; color: #1d1b20"
        >
          Câu hỏi thường gặp
        </h2>
      </div>

      <!-- Accordion using UAccordion with items prop -->
      <UAccordion
        :items="faqItems"
        default-value="0"
        :ui="{
          root: 'w-full flex flex-col gap-3',
          item: 'rounded-2xl border border-slate-100 overflow-hidden bg-white last:border-b',
          trigger: 'px-6 py-4 font-semibold text-sm hover:bg-slate-50 transition-colors',
          body: 'px-6 pb-5 text-sm leading-relaxed',
          trailingIcon: 'text-emerald-500',
          label: 'text-slate-800',
        }"
      />
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const faqItems: AccordionItem[] = [
  {
    label: "NgheGo có miễn phí không?",
    content:
      "Hoàn toàn miễn phí! Bạn có thể sử dụng tất cả các tính năng luyện tập cơ bản mà không tốn một xu nào.",
  },
  {
    label: "Có cần tài khoản không?",
    content:
      "Không cần tài khoản để bắt đầu luyện tập. Tuy nhiên, đăng ký tài khoản giúp bạn lưu tiến độ, theo dõi streak và nhận đề xuất video cá nhân hóa.",
  },
  {
    label: "Dùng được trên mobile không?",
    content:
      "Có! NgheGo được thiết kế responsive, hoạt động tốt trên mọi thiết bị từ điện thoại, máy tính bảng đến máy tính.",
  },
  {
    label: "Dùng video bất kỳ được không?",
    content:
      "Bạn có thể dán bất kỳ link YouTube nào có phụ đề tiếng Anh. NgheGo sẽ tự động xử lý và tạo bài luyện tập từ video đó.",
  },
  {
    label: "NgheGo có lưu streak không?",
    content:
      "Có! Khi đăng nhập, hệ thống sẽ tự động theo dõi và lưu streak học tập hàng ngày của bạn, giúp duy trì động lực học tập.",
  },
];
</script>
