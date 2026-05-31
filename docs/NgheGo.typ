// ===========================================================================
// CẤU HÌNH TRANG & BIẾN TOÀN CỤC
// ===========================================================================

#set document(title: "NgheGo - Giải pháp WCAG 2.2", author: "Nhóm NgheGo")

// Bảng màu hệ thống (Design Tokens)
#let brand = (
  primary: rgb("#1d4ed8"), // Accent blue
  secondary: rgb("#1e3a5f"), // Deep blue for headings
  dark: rgb("#374151"), // Slate dark for text/subheadings
  muted: rgb("#6b7280"), // Gray for captions
  light: rgb("#f0f4ff"), // Light blue background
  border: rgb("#cbd5e1"), // Light gray for lines
  table-bg: rgb("#f9fafb"), // Zebra striping color
)

#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 2.5cm),
  numbering: "1",
  header: context {
    if counter(page).get().first() > 2 {
      set text(size: 9pt, fill: brand.muted)
      grid(
        columns: (1fr, auto),
        align: (left, right),
        [NgheGo -- Giải pháp WCAG 2.2], counter(page).display("1"),
      )
      line(length: 100%, stroke: 0.4pt + rgb("#d1d5db"))
    }
  },
)

// --- Typography -------------------------------------------------------------
#set text(font: "Crimson Pro", size: 11.5pt, lang: "vi")
#set par(justify: true, leading: 0.8em, spacing: 1.2em)
#set heading(numbering: "1.1.")

// ===========================================================================
// ĐỊNH DẠNG COMPONENT (CUSTOM FUNCTIONS)
// ===========================================================================

// Tiêu đề các cấp
#show heading.where(level: 1): it => {
  v(1.4em)
  block(
    fill: brand.light,
    radius: 4pt,
    inset: (x: 10pt, y: 7pt),
    width: 100%,
    text(size: 14pt, weight: "bold", fill: brand.primary, it),
  )
  v(0.4em)
}

#show heading.where(level: 2): it => {
  v(0.9em)
  text(size: 12.5pt, weight: "bold", fill: brand.secondary, it)
  v(0.2em)
  line(length: 100%, stroke: 0.5pt + brand.border)
  v(0.2em)
}

#show heading.where(level: 3): it => {
  v(0.6em)
  text(size: 11.5pt, weight: "bold", style: "italic", fill: brand.dark, it)
  v(0.1em)
}

// Định dạng bảng chuẩn WCAG đồng bộ
#let wcag-table(columns, ..cells) = table(
  columns: columns,
  inset: 8pt,
  stroke: 0.4pt + rgb("#e5e7eb"),
  fill: (_, row) => if row == 0 { brand.light } else if calc.odd(row) { brand.table-bg } else { white },
  ..cells
)

// Thẻ bọc thông tin công nghệ (Grid Card)
#let tech-card(title, description) = block(
  fill: brand.light,
  radius: 4pt,
  inset: (x: 10pt, y: 9pt),
  width: 100%,
  [
    #text(weight: "bold", fill: brand.secondary)[#title] \
    #text(size: 10pt)[#description]
  ],
)


// ===========================================================================
// TRANG BÌA
// ===========================================================================
#page(numbering: none, header: none)[
  #v(2.5cm)
  #align(center)[
    #block(
      fill: brand.primary,
      radius: 8pt,
      inset: (x: 24pt, y: 16pt),
      text(size: 32pt, weight: "bold", fill: white)[NgheGo],
    )
    #v(0.6cm)
    #text(size: 14pt, fill: brand.dark)[
      Ứng dụng luyện Nghe và Gõ chính tả Tiếng Anh với video YouTube
    ]
    #v(1.2cm)
    #line(length: 55%, stroke: 1.5pt + brand.primary)
    #v(1.2cm)

    #block(
      fill: brand.light,
      radius: 6pt,
      inset: (x: 20pt, y: 14pt),
      width: 80%,
      [
        #text(size: 10pt, fill: brand.muted)[TÀI LIỆU DỰ THI] \
        #v(0.3em)
        #text(size: 12pt, weight: "bold")[
          Cuộc thi Thiết kế Website / Ứng dụng số \
          đảm bảo tiêu chuẩn tiếp cận WCAG 2.2
        ]
      ],
    )

    #v(2cm)
    #text(size: 10.5pt, fill: brand.muted)[
      *Nhóm tác giả* \
      Võ Văn Duy -- Võ Quang Chiến -- Nguyễn Gia Hưng
    ]
  ]
]

// ===========================================================================
// MỤC LỤC
// ===========================================================================
#page(numbering: none, header: none)[
  #v(1cm)
  #text(size: 16pt, weight: "bold", fill: brand.primary)[Mục lục]
  #v(0.5em)
  #line(length: 100%, stroke: 1pt + brand.primary)
  #v(0.5em)
  #outline(title: none, indent: 1.5em, depth: 3)
]

// ===========================================================================
= Giới thiệu sản phẩm

== Tổng quan
*NgheGo* là ứng dụng web miễn phí hỗ trợ người học tiếng Anh tại Việt Nam cải thiện kỹ năng nghe thông qua phương pháp gõ chính tả (dictation) với video YouTube. Người dùng dán URL video vào ứng dụng; hệ thống tự động tạo transcript bằng AI, chia thành từng câu để nghe và gõ lại. Kết quả được đối chiếu tức thì với transcript gốc, giúp người học nhận biết và khắc phục lỗi sai hiệu quả.

*Đối tượng hướng đến:* sinh viên, người đi làm muốn nâng cao kỹ năng nghe tiếng Anh thực tế; người dùng khiếm thị sử dụng trình đọc màn hình; người dùng chỉ dùng bàn phím; người cao tuổi cần chữ lớn và tương phản cao; người dùng trên thiết bị di động.

== Tính năng chính
- *Nhập video tùy ý:* hỗ trợ mọi URL YouTube công khai.
- *Transcript AI:* nhận dạng chính xác nhiều giọng tiếng Anh.
- *Luyện từng câu:* nghe và gõ lại từng đoạn ngắn, có thể phát lại nhiều lần.
- *Phản hồi tức thì:* tô màu đúng/sai theo từng từ sau mỗi lần nộp.
- *Theo dõi tiến trình:* điểm accuracy từng câu và thống kê tổng hợp theo phiên.
- *Đăng nhập Google:* đồng bộ lịch sử luyện tập giữa các thiết bị.
- *Miễn phí hoàn toàn:* không giới hạn số lượng video, không phí ẩn.

== Công nghệ sử dụng
NgheGo được xây dựng trên nền tảng *Nuxt* -- framework fullstack dựa trên Vue.js, cung cấp Server-Side Rendering (SSR) và file-based routing. Phía server sử dụng engine *Nitro*, cho phép triển khai linh hoạt trên nhiều môi trường (Node.js, edge, serverless) và xử lý API routes ngay trong cùng dự án. Giao diện được xây dựng với thư viện component *Nuxt UI*, tích hợp sẵn TailwindCSS và hỗ trợ dark mode; các component đã được xây dựng theo chuẩn WAI-ARIA, giảm thiểu nhân lực cần thiết để tuân thủ các yêu cầu trợ năng.

#v(0.3em)
#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 8pt,
  tech-card(
    "Nuxt",
    "Framework fullstack Vue.js; SSR với Nitro; file-based routing; NuxtAnnouncer và NuxtRouteAnnouncer hỗ trợ trợ năng tích hợp sẵn.",
  ),
  tech-card(
    "Nitro",
    "Server engine đa nền tảng; xử lý API routes và middleware trong cùng dự án; hỗ trợ triển khai serverless và edge computing.",
  ),
  tech-card(
    "Nuxt UI",
    "Thư viện component tích hợp TailwindCSS; các component tuân thủ WAI-ARIA; hỗ trợ dark mode và theming nhất quán qua design tokens.",
  ),
)
#v(0.5em)


// ===========================================================================
= Giải pháp áp dụng tiêu chuẩn WCAG 2.2

NgheGo được thiết kế và phát triển đạt mức tuân thủ *WCAG 2.2 cấp AA* trên toàn ứng dụng. Bốn nguyên tắc cốt lõi -- *Perceivable, Operable, Understandable, Robust* -- được tích hợp xuyên suốt từ giai đoạn thiết kế đến triển khai.

== Có thể nhận biết (Perceivable)

=== Văn bản thay thế và đa phương tiện
Toàn bộ hình ảnh mang thông tin có thuộc tính `alt` mô tả nội dung; icon trang trí được đánh dấu `aria-hidden="true"`. Vì âm thanh là trung tâm ứng dụng, nội dung được trình bày song song qua nhiều kênh:
- *Transcript hiển thị đồng thời:* bản chép lời đầy đủ xuất hiện ngay trên giao diện luyện tập, đóng vai trò bản ghi nội dung theo yêu cầu tiêu chí 1.2.1.
- *Phản hồi đa kênh:* kết quả đúng/sai thể hiện bằng cả màu sắc lẫn gạch chân và biểu tượng -- không phụ thuộc duy nhất vào màu (tiêu chí 1.4.1).
- *Thông báo văn bản:* mọi trạng thái xử lý hiển thị qua nhãn văn bản rõ ràng, không chỉ qua âm thanh.

=== Cấu trúc thích ứng
HTML ngữ nghĩa được áp dụng nhất quán: tiêu đề phân cấp `h1` đến `h3` đúng thứ tự; landmark ARIA (`header`, `main`, `nav`, `footer`); danh sách dùng `ol`/`ul`; nhãn form liên kết qua thuộc tính `for`/`id` hoặc `aria-label`. Ô nhập URL khai báo `aria-label` để trình đọc màn hình thông báo mục đích trường nhập liệu.

=== Phân biệt và tương phản
#wcag-table(
  (2.6cm, 1fr),
  [*Tiêu chí*],
  [*Giải pháp*],
  [1.4.3 và 1.4.11],
  [TailwindCSS kết hợp design tokens đảm bảo tỉ lệ tương phản tối thiểu 4.5:1 cho văn bản thông thường và 3:1 cho thành phần giao diện. Kiểm tra cả chế độ sáng và tối.],
  [1.4.4],
  [Toàn bộ kích thước chữ dùng đơn vị tương đối (rem, em); giao diện không mất nội dung khi phóng to lên 200%.],
  [1.4.2],
  [Không tự động phát âm thanh khi tải trang; mọi phát lại âm thanh đều do người dùng chủ động kích hoạt.],
)


== Có thể vận hành (Operable)

=== Điều hướng bàn phím
Toàn bộ chức năng sử dụng được chỉ bằng bàn phím, không cần chuột:
- `Tab` / `Shift+Tab` di chuyển qua các phần tử tương tác theo thứ tự logic từ trên xuống dưới.
- `Enter` / `Space` kích hoạt nút bấm và liên kết; `Esc` thoát khỏi modal và dropdown -- không có bẫy bàn phím.
- `Ctrl+Enter` nộp câu trả lời trong ô luyện tập; phím tắt bổ sung (`Ctrl+I`, `Meta+J/K`) được thông báo qua tooltip và hoạt động hoàn toàn bằng bàn phím.
- Modal, dropdown, accordion triển khai theo chuẩn WAI-ARIA Authoring Practices, đảm bảo hành vi nhất quán.

=== Định vị và điều hướng
#wcag-table(
  (3.2cm, 1fr),
  [*Tiêu chí*],
  [*Giải pháp*],
  [2.4.1 -- Skip link],
  [Liên kết "Bỏ qua điều hướng" ẩn (`.sr-only-focusable`, `position: fixed`) hiện ra khi nhận focus bàn phím, dẫn đến `main-content` với `tabindex="-1"`. Không gây layout shift.],
  [2.4.2 -- Tiêu đề trang],
  [Mỗi trang có `title` riêng biệt mô tả nội dung. Trang luyện tập: "Luyện nghe chép chính tả: [Tên video] - NgheGo".],
  [2.4.7 và 2.4.11],
  [Chỉ báo focus rõ ràng, tương phản tối thiểu 3:1; `scroll-margin-top` ngăn header cố định che khuất vùng focus.],
  [2.4.4 -- Liên kết],
  [Mọi liên kết có văn bản mô tả mục đích cụ thể; nút chỉ có icon được bổ sung `aria-label` mô tả hành động.],
)

=== Phương thức nhập liệu (tiêu chí mới trong WCAG 2.2)
- *2.5.8 -- Kích thước vùng chạm:* nút bấm tối thiểu 24x24 px; các nút chính đạt 44x44 px để thao tác thoải mái trên thiết bị di động.
- *2.5.7 -- Không kéo:* mọi tương tác thực hiện bằng nhấp/chạm đơn; không có chức năng nào yêu cầu thao tác kéo thả.
- *2.5.2 -- Hủy con trỏ:* hành động quan trọng kích hoạt tại sự kiện `pointerup`, cho phép người dùng hủy bằng cách kéo con trỏ ra ngoài trước khi thả.

=== Chuyển động và hoạt ảnh
Thư viện Motion Vue điều khiển hiệu ứng fade-in và blur. Toàn bộ hoạt ảnh tôn trọng cài đặt hệ thống `prefers-reduced-motion: reduce` -- tắt hoàn toàn khi người dùng bật chế độ giảm chuyển động.


== Có thể hiểu (Understandable)

=== Ngôn ngữ
Thẻ `html` khai báo `lang="vi"` để trình đọc màn hình sử dụng đúng bộ tổng hợp giọng nói tiếng Việt. Các đoạn văn bản tiếng Anh được bao bọc trong phần tử có `lang="en"` để trình đọc màn hình chuyển sang giọng tiếng Anh phù hợp.

=== Hành vi nhất quán
- Header, footer và thứ tự menu đồng nhất trên mọi trang (tiêu chí 3.2.3).
- Ứng dụng không tự chuyển trang hay gửi form khi người dùng chỉ di chuyển focus hoặc thay đổi giá trị input (3.2.1 và 3.2.2).
- Liên kết FAQ và thông tin liên hệ luôn hiển thị ở footer trên toàn bộ các trang -- trợ giúp nhất quán theo tiêu chí 3.2.6 (mới trong WCAG 2.2).

=== Hỗ trợ nhập liệu và xử lý lỗi
#wcag-table(
  (3.6cm, 1fr),
  [*Tiêu chí*],
  [*Giải pháp*],
  [3.3.1 -- Nhận diện lỗi],
  [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role],
  [3.3.2 -- Nhãn và hướng dẫn],
  [Mọi trường nhập có nhãn rõ ràng. Ô nhập URL có placeholder mô tả định dạng mong đợi: "https://www.youtube.com/watch?v=example".],
  [3.3.7 -- Không nhập lại],
  [Tiến trình lưu qua IndexedDB; khi người dùng quay lại video đã luyện, hệ thống tự động khôi phục vị trí câu cuối, không yêu cầu bắt đầu lại từ đầu.],
  [3.3.8 -- Xác thực dễ dàng],
  [Đăng nhập qua Google OAuth -- không mật khẩu, không CAPTCHA; trình duyệt có thể tự động điền thông tin đăng nhập.],
)


== Mạnh mẽ (Robust)

=== HTML ngữ nghĩa và ARIA
NgheGo ưu tiên phần tử HTML gốc (`button`, `input`, `nav`, `main`) thay vì `div` với ARIA role. Khi cần dùng ARIA, các thuộc tính `role`, `aria-label`, `aria-describedby`, `aria-expanded`, `aria-live` được áp dụng đúng theo đặc tả WAI-ARIA. Đã kiểm tra tương thích với VoiceOver (macOS và iOS) và NVDA (Windows).

=== Thông báo trạng thái (4.1.3)
Thay đổi động (kết quả kiểm tra câu, tiến trình xử lý video, lỗi) được thông báo đến trình đọc màn hình qua vùng `aria-live` mà không cần chuyển focus: giá trị `polite` cho thông tin thông thường, `role="alert"` cho lỗi khẩn cấp. `NuxtRouteAnnouncer` đặt ở root ứng dụng thông báo chuyển trang đến trình đọc màn hình.

=== Kỹ thuật trợ năng bổ sung
#wcag-table(
  (3.2cm, 1fr),
  [*Kỹ thuật*],
  [*Mô tả*],
  [Announcer],
  [`NuxtAnnouncer` kết hợp `useAnnouncer()` gửi thông báo trạng thái trong trang. Gọi `polite()` cho thông tin không khẩn cấp; `assertive()` chỉ khi cần ngắt thông báo hiện tại. Âm thanh success/error được giữ lại cho người không dùng trình đọc màn hình; luôn có thông báo văn bản tương ứng để đảm bảo tiếp cận đầy đủ.],
  [Phản hồi mức từ],
  [Từ sai được gạch chân ngoài màu sắc, hỗ trợ người mù màu. Từ hiện tại hiển thị ký tự ẩn; có tùy chọn gợi ý chữ cái đầu để giảm khó khăn cho người học.],
  [Skip link],
  [Phần tử cố định (`position: fixed`) với class `.sr-only-focusable`, ẩn hoàn toàn cho đến khi nhận focus bàn phím. Không gây layout shift. Vùng chính nhận `tabindex="-1"` và focus ngay khi skip link được kích hoạt.],
  [Quản lý focus],
  [`scroll-margin-top` áp dụng cho các mục tiêu focus để tránh bị header cố định che khuất. Không sử dụng `outline: none` ở bất kỳ phần tử nào; viền focus tương phản tối thiểu 3:1 trên toàn ứng dụng.],
  [Tương thích đa nền tảng],
  [Kiểm tra trên Chrome, Firefox, Safari và Edge. Giao diện responsive từ 320 px (điện thoại nhỏ) đến 1920 px. Nội dung ban đầu render phía server (SSR với Nuxt và Nitro), không phụ thuộc JavaScript.],
)
