#set document(title: "NgheGo – Giải pháp áp dụng tiêu chuẩn WCAG 2.2", author: "Nhóm NgheGo")
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 2.5cm),
  numbering: "1",
)
#set text(font: "Crimson Pro", size: 12pt, lang: "vi")
#set heading(numbering: "1.1.")
#set par(justify: true, leading: 0.75em)

#show heading.where(level: 1): it => {
  v(1.2em)
  text(size: 15pt, weight: "bold", it)
  v(0.5em)
}
#show heading.where(level: 2): it => {
  v(0.8em)
  text(size: 13pt, weight: "bold", it)
  v(0.3em)
}

// ─── Trang bìa ───────────────────────────────────────────────────────────────
#align(center)[
  #v(3cm)
  #text(size: 22pt, weight: "bold")[NgheGo]
  #v(0.5cm)
  #text(size: 14pt)[Ứng dụng luyện nghe chép chính tả tiếng Anh với video YouTube]
  #v(1cm)
  #line(length: 60%)
  #v(1cm)
  #text(size: 12pt)[
    *Tài liệu giới thiệu sản phẩm dự thi*\
    Cuộc thi Thiết kế website/ứng dụng số đảm bảo tiếp cận số theo tiêu chuẩn WCAG 2.2
  ]
  #v(2cm)
  #text(size: 11pt)[
    Nhóm tác giả: Võ Văn Duy · Võ Quang Chiến · Nguyễn Gia Hưng\
    Tháng 6 năm 2026
  ]
]

#pagebreak()

// ─── Mục lục ─────────────────────────────────────────────────────────────────
#outline(title: "Mục lục", indent: 1.5em)

#pagebreak()

// ─── 1. Giới thiệu sản phẩm ──────────────────────────────────────────────────
= Giới thiệu sản phẩm

== Tổng quan

*NgheGo* là ứng dụng web miễn phí giúp người học tiếng Anh tại Việt Nam cải thiện kỹ năng nghe thông qua phương pháp luyện chép chính tả (dictation) với video YouTube. Người dùng dán đường dẫn video YouTube vào ứng dụng, hệ thống tự động tạo bản chép lời (transcript) bằng AI, sau đó chia nhỏ thành từng câu để người dùng nghe và gõ lại. Kết quả được so sánh tức thì với transcript gốc, giúp người học nhận biết lỗi sai và cải thiện từng ngày.

Ứng dụng hướng đến đối tượng chính là sinh viên và người đi làm người Việt muốn nâng cao kỹ năng nghe tiếng Anh thực tế, không bị giới hạn bởi nội dung học thuật nhân tạo.

== Tính năng chính

- *Nhập video YouTube tùy ý:* Người dùng dán URL bất kỳ; hệ thống tự động tải và xử lý.
- *Tạo transcript bằng AI:* Hệ thống phân tích audio và tạo bản chép lời chính xác cao, hỗ trợ nhiều giọng tiếng Anh.
- *Luyện tập từng câu:* Video được chia thành các đoạn ngắn; người dùng nghe và gõ lại từng câu.
- *Phản hồi tức thì:* So sánh kết quả với transcript gốc, hiển thị lỗi sai theo từng từ.
- *Theo dõi tiến trình:* Điểm Accuracy cho từng câu và thống kê tổng hợp theo phiên luyện tập.
- *Đăng nhập Google:* Lưu lịch sử luyện tập và đồng bộ tiến trình giữa các thiết bị.
- *Hoàn toàn miễn phí:* Không giới hạn số lượng video, không phí ẩn.

== Đối tượng người dùng

NgheGo phục vụ đa dạng người dùng, bao gồm:

- Sinh viên và người đi làm muốn cải thiện kỹ năng nghe tiếng Anh.
- Người dùng có khuyết tật thị giác sử dụng trình đọc màn hình.
- Người dùng chỉ dùng bàn phím, không dùng chuột.
- Người dùng cao tuổi cần chữ lớn và độ tương phản cao.
- Người dùng trên thiết bị di động với màn hình cảm ứng.

#pagebreak()

// ─── 2. Giải pháp áp dụng WCAG 2.2 ──────────────────────────────────────────
= Giải pháp áp dụng tiêu chuẩn WCAG 2.2

NgheGo được thiết kế và phát triển với mục tiêu đạt mức tuân thủ *WCAG 2.2 cấp AA* trên toàn bộ ứng dụng. Bốn nguyên tắc cốt lõi của WCAG — *Perceivable (Có thể nhận biết), Operable (Có thể vận hành), Understandable (Có thể hiểu), Robust (Mạnh mẽ)* — được tích hợp xuyên suốt từ giai đoạn thiết kế đến triển khai.

== Có thể nhận biết (Perceivable)

=== Văn bản thay thế cho nội dung phi văn bản

Tất cả hình ảnh mang thông tin trong NgheGo đều có thuộc tính `alt` mô tả nội dung. Ảnh đại diện thành viên nhóm trên trang Giới thiệu có `alt` là tên thành viên. Các biểu tượng (icon) trang trí thuần túy được đánh dấu `aria-hidden="true"` để trình đọc màn hình bỏ qua, tránh nhiễu thông tin.

=== Nội dung đa phương tiện

NgheGo là ứng dụng luyện nghe, do đó nội dung âm thanh là trung tâm. Để đảm bảo người dùng khiếm thính vẫn có thể sử dụng:

- *Transcript hiển thị song song:* Bản chép lời đầy đủ của video được hiển thị ngay trên giao diện luyện tập, đóng vai trò là bản ghi nội dung (transcript) theo yêu cầu tiêu chí 1.2.1.
- *Phản hồi bằng văn bản:* Mọi kết quả so sánh (đúng/sai từng từ) đều được thể hiện bằng màu sắc kết hợp với văn bản, không chỉ dựa vào âm thanh.
- *Thông báo trạng thái bằng văn bản:* Các bước xử lý video (tải dữ liệu, tạo transcript, phân tích nội dung) được hiển thị dưới dạng danh sách bước có nhãn văn bản rõ ràng.

=== Nội dung có thể thích ứng

Cấu trúc trang được xây dựng bằng HTML ngữ nghĩa đúng chuẩn:

- Tiêu đề phân cấp `<h1>` → `<h2>` → `<h3>` theo đúng thứ tự logic, không bỏ cấp.
- Các vùng landmark ARIA (`<header>`, `<main>`, `<nav>`, `<footer>`) giúp trình đọc màn hình điều hướng nhanh.
- Danh sách bước luyện tập dùng `<ol>` / `<ul>` thay vì `<div>` thuần túy.
- Nhãn form (`<label>`) liên kết rõ ràng với trường nhập liệu qua thuộc tính `for`/`id` hoặc `aria-label`.

Ô nhập URL YouTube trên trang chủ có `aria-label="Dán link YouTube vào đây"` để trình đọc màn hình thông báo mục đích trường nhập liệu.

=== Nội dung có thể phân biệt

*Độ tương phản màu sắc (1.4.3, 1.4.11):*

NgheGo sử dụng hệ thống màu và utility class của TailwindCSS kết hợp biến thiết kế (design tokens), đảm bảo tỉ lệ tương phản tối thiểu 4.5:1 cho văn bản thông thường và 3:1 cho văn bản lớn và thành phần giao diện. Cả chế độ sáng (light mode) và tối (dark mode) đều được kiểm tra độ tương phản.

*Không dùng màu sắc làm phương tiện duy nhất (1.4.1):*

Kết quả so sánh từng từ trong bài luyện tập sử dụng đồng thời màu sắc (xanh/đỏ) và biểu tượng/gạch chân để phân biệt từ đúng và từ sai, đảm bảo người dùng mù màu vẫn nhận biết được.

*Thay đổi kích thước văn bản (1.4.4):*

Toàn bộ kích thước chữ dùng đơn vị tương đối (`rem`, `em`). Giao diện vẫn sử dụng được khi trình duyệt phóng to đến 200% mà không mất nội dung hay chức năng.

*Không có nội dung âm thanh tự động (1.4.2):*

Ứng dụng không tự động phát âm thanh khi tải trang. Mọi phát lại audio đều do người dùng chủ động kích hoạt.

#pagebreak()

== Có thể vận hành (Operable)

=== Điều hướng bằng bàn phím

Toàn bộ chức năng của NgheGo có thể sử dụng chỉ bằng bàn phím, không cần chuột:

- *Điều hướng tổng thể:* Phím `Tab` / `Shift+Tab` di chuyển qua tất cả phần tử tương tác theo thứ tự logic từ trên xuống dưới, trái sang phải.
- *Kích hoạt nút:* Phím `Enter` và `Space` kích hoạt tất cả nút bấm và liên kết.
- *Ô nhập liệu luyện tập:* Người dùng gõ câu trả lời trực tiếp vào `<textarea>` và nhấn `Enter` để kiểm tra, không cần dùng chuột.
- *Không có bẫy bàn phím:* Người dùng luôn có thể thoát khỏi mọi thành phần (modal, dropdown) bằng phím `Escape`.

Các thành phần giao diện tương tác (modal, dropdown, accordion, menu) được triển khai theo chuẩn WAI-ARIA Authoring Practices, bảo đảm hỗ trợ bàn phím đầy đủ và hành vi nhất quán.

=== Điều hướng và định vị

*Skip link – Bỏ qua điều hướng (2.4.1):*

NgheGo có liên kết "Bỏ qua điều hướng" ẩn ở đầu trang, hiện ra khi nhận focus bàn phím, cho phép người dùng nhảy thẳng đến nội dung chính mà không phải Tab qua toàn bộ thanh điều hướng. Vùng nội dung chính được đánh dấu bằng `id="main-content"` và `tabindex="-1"` để nhận focus khi skip link được kích hoạt.

*Tiêu đề trang mô tả (2.4.2):*

Mỗi trang có tiêu đề `<title>` riêng biệt và mô tả nội dung trang. Trang luyện tập hiển thị tên video trong tiêu đề: `"Luyện nghe chép chính tả: [Tên video] - NgheGo"`.

*Tiêu điểm hiển thị (2.4.7, 2.4.11):*

Tất cả phần tử tương tác đều có chỉ báo focus rõ ràng khi nhận focus bàn phím (`:focus-visible`). Ứng dụng không dùng `outline: none` mà thay thế bằng viền focus có độ tương phản đủ 3:1. Các phần tử nhận focus không bị che khuất bởi header cố định nhờ `scroll-margin-top` phù hợp.

*Mục đích liên kết (2.4.4):*

Tất cả liên kết có văn bản mô tả rõ mục đích. Không có liên kết "Nhấn vào đây" hay "Xem thêm" mơ hồ. Các nút icon có `aria-label` mô tả hành động.

=== Phương thức nhập liệu

*Kích thước vùng chạm (2.5.8 – mới trong WCAG 2.2):*

Tất cả nút bấm và liên kết có kích thước tối thiểu 24×24 CSS pixel. Các nút chính (Bắt đầu, Kiểm tra, Tiếp theo) có kích thước thoải mái 44×44 pixel để dễ chạm trên thiết bị di động.

*Không yêu cầu thao tác kéo (2.5.7 – mới trong WCAG 2.2):*

NgheGo không có chức năng nào yêu cầu thao tác kéo (drag). Mọi tương tác đều thực hiện được bằng nhấp/chạm đơn giản.

*Kích hoạt con trỏ (2.5.2):*

Các hành động quan trọng (xóa, nộp bài) chỉ kích hoạt khi nhả chuột (mouseup/pointerup), không phải khi nhấn (mousedown), cho phép người dùng hủy bằng cách kéo con trỏ ra ngoài.

=== Chuyển động và hoạt ảnh

*Tôn trọng tùy chọn giảm chuyển động (2.3.3):*

NgheGo sử dụng thư viện Motion Vue cho các hiệu ứng xuất hiện (fade-in, blur). Tất cả hoạt ảnh đều tôn trọng tùy chọn hệ thống `prefers-reduced-motion: reduce` — khi người dùng bật chế độ này, hoạt ảnh được tắt hoàn toàn.

#pagebreak()

== Có thể hiểu (Understandable)

=== Ngôn ngữ trang

Thẻ `<html>` khai báo `lang="vi"` để trình đọc màn hình sử dụng đúng bộ tổng hợp giọng nói tiếng Việt. Các đoạn văn bản tiếng Anh (ví dụ: câu luyện tập, transcript) được bao bọc trong thẻ có `lang="en"` để trình đọc màn hình chuyển sang giọng tiếng Anh phù hợp.

=== Hành vi nhất quán và có thể đoán trước

- *Điều hướng nhất quán (3.2.3):* Header và footer xuất hiện ở cùng vị trí trên tất cả các trang. Thứ tự các mục menu không thay đổi.
- *Không thay đổi ngữ cảnh tự động (3.2.1, 3.2.2):* Ứng dụng không tự động chuyển trang hay gửi form khi người dùng chỉ di chuyển focus hoặc thay đổi giá trị input. Mọi hành động quan trọng đều yêu cầu người dùng xác nhận bằng nút bấm rõ ràng.
- *Trợ giúp nhất quán (3.2.6 – mới trong WCAG 2.2):* Liên kết FAQ và thông tin liên hệ xuất hiện ở cùng vị trí (footer) trên tất cả các trang.

=== Hỗ trợ nhập liệu và xử lý lỗi

*Nhận diện lỗi (3.3.1):*

Khi người dùng nhập URL YouTube không hợp lệ, thông báo lỗi xuất hiện bằng văn bản mô tả cụ thể vấn đề (ví dụ: "URL không hợp lệ, vui lòng kiểm tra lại"). Thông báo lỗi được thông báo đến trình đọc màn hình qua `role="alert"`.

*Nhãn và hướng dẫn (3.3.2):*

Tất cả trường nhập liệu có nhãn rõ ràng. Ô nhập URL có placeholder mô tả định dạng mong đợi: `"https://www.youtube.com/watch?v=example"`.

*Không nhập lại thông tin thừa (3.3.7 – mới trong WCAG 2.2):*

Trong phiên luyện tập, hệ thống ghi nhớ tiến trình qua IndexedDB. Khi người dùng quay lại video đã luyện, ứng dụng tự động khôi phục vị trí câu cuối cùng, không yêu cầu người dùng bắt đầu lại từ đầu.

*Xác thực truy cập dễ dàng (3.3.8 – mới trong WCAG 2.2):*

NgheGo sử dụng đăng nhập Google OAuth — người dùng không cần nhớ mật khẩu. Trình duyệt có thể tự động điền thông tin đăng nhập. Không có CAPTCHA hay bài kiểm tra nhận thức nào trong luồng xác thực.

#pagebreak()

== Mạnh mẽ (Robust)

=== Tương thích với công nghệ hỗ trợ

*HTML ngữ nghĩa và ARIA đúng chuẩn (4.1.2):*

NgheGo ưu tiên dùng phần tử HTML gốc (`<button>`, `<input>`, `<nav>`, `<main>`) thay vì `<div>` với ARIA role. Khi cần dùng ARIA, các thuộc tính `role`, `aria-label`, `aria-describedby`, `aria-expanded`, `aria-live` được áp dụng đúng theo đặc tả WAI-ARIA.

Các thành phần phức tạp như modal, dropdown, accordion được xây dựng theo mẫu ARIA chuẩn và đã được kiểm tra tương thích với VoiceOver (macOS/iOS) và NVDA (Windows).

*Thông báo trạng thái (4.1.3):*

Các thay đổi trạng thái động — như kết quả kiểm tra câu, tiến trình xử lý video, thông báo lỗi — được thông báo đến trình đọc màn hình qua `aria-live` region mà không cần chuyển focus. Thông báo thông thường dùng `aria-live="polite"`, thông báo lỗi khẩn cấp dùng `role="alert"`.

*Tương thích đa trình duyệt và thiết bị:*

Ứng dụng được kiểm tra trên Chrome, Firefox, Safari và Edge. Giao diện responsive hoạt động tốt trên màn hình từ 320px (điện thoại nhỏ) đến 1920px (màn hình lớn). Các tính năng cốt lõi không phụ thuộc vào JavaScript để render nội dung ban đầu (SSR với Nuxt).

#pagebreak()

// ─── 3. Bảng tổng hợp tuân thủ WCAG 2.2 ─────────────────────────────────────
= Bảng tổng hợp tuân thủ WCAG 2.2

Bảng dưới đây tóm tắt các tiêu chí WCAG 2.2 được áp dụng trong NgheGo, tập trung vào cấp A và AA, bao gồm cả 9 tiêu chí mới bổ sung trong WCAG 2.2.

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  align: (left, left, center, left),
  stroke: 0.5pt,
  fill: (col, row) => if row == 0 { rgb("#e8f4f8") } else if calc.odd(row) { rgb("#f9f9f9") } else { white },
  [*Tiêu chí*], [*Mô tả*], [*Cấp*], [*Trạng thái*],
  [1.1.1], [Văn bản thay thế cho hình ảnh và icon], [A], [✅ Đạt],
  [1.2.1], [Transcript cho nội dung âm thanh], [A], [✅ Đạt],
  [1.3.1], [Thông tin và quan hệ – HTML ngữ nghĩa], [A], [✅ Đạt],
  [1.3.2], [Thứ tự đọc có ý nghĩa], [A], [✅ Đạt],
  [1.3.3], [Đặc điểm cảm giác – không chỉ dùng màu/hình dạng], [A], [✅ Đạt],
  [1.3.4], [Hướng màn hình – hỗ trợ cả ngang và dọc], [AA], [✅ Đạt],
  [1.3.5], [Xác định mục đích trường nhập liệu (autocomplete)], [AA], [✅ Đạt],
  [1.4.1], [Không dùng màu sắc làm phương tiện duy nhất], [A], [✅ Đạt],
  [1.4.2], [Không tự động phát âm thanh], [A], [✅ Đạt],
  [1.4.3], [Độ tương phản tối thiểu 4.5:1 cho văn bản], [AA], [✅ Đạt],
  [1.4.4], [Thay đổi kích thước văn bản đến 200%], [AA], [✅ Đạt],
  [1.4.10], [Reflow – không cuộn ngang ở 320px], [AA], [✅ Đạt],
  [1.4.11], [Tương phản thành phần giao diện 3:1], [AA], [✅ Đạt],
  [1.4.12], [Khoảng cách văn bản có thể điều chỉnh], [AA], [✅ Đạt],
  [2.1.1], [Toàn bộ chức năng dùng được bằng bàn phím], [A], [✅ Đạt],
  [2.1.2], [Không có bẫy bàn phím], [A], [✅ Đạt],
  [2.4.1], [Skip link – bỏ qua điều hướng lặp lại], [A], [✅ Đạt],
  [2.4.2], [Tiêu đề trang mô tả nội dung], [A], [✅ Đạt],
  [2.4.3], [Thứ tự focus logic], [A], [✅ Đạt],
  [2.4.4], [Mục đích liên kết rõ ràng], [A], [✅ Đạt],
  [2.4.6], [Tiêu đề và nhãn mô tả], [AA], [✅ Đạt],
  [2.4.7], [Focus hiển thị rõ ràng], [AA], [✅ Đạt],
  [2.4.11], [Focus không bị che khuất (mới WCAG 2.2)], [AA], [✅ Đạt],
  [2.5.2], [Hủy con trỏ – kích hoạt khi nhả], [A], [✅ Đạt],
  [2.5.3], [Nhãn trong tên truy cập], [A], [✅ Đạt],
  [2.5.7], [Không yêu cầu thao tác kéo (mới WCAG 2.2)], [AA], [✅ Đạt],
  [2.5.8], [Kích thước vùng chạm tối thiểu 24px (mới WCAG 2.2)], [AA], [✅ Đạt],
  [3.1.1], [Ngôn ngữ trang khai báo đúng], [A], [✅ Đạt],
  [3.1.2], [Ngôn ngữ đoạn văn bản khai báo đúng], [AA], [✅ Đạt],
  [3.2.1], [Không thay đổi ngữ cảnh khi focus], [A], [✅ Đạt],
  [3.2.2], [Không thay đổi ngữ cảnh khi nhập liệu], [A], [✅ Đạt],
  [3.2.3], [Điều hướng nhất quán], [AA], [✅ Đạt],
  [3.2.6], [Trợ giúp nhất quán (mới WCAG 2.2)], [A], [✅ Đạt],
  [3.3.1], [Nhận diện lỗi bằng văn bản], [A], [✅ Đạt],
  [3.3.2], [Nhãn và hướng dẫn cho trường nhập liệu], [A], [✅ Đạt],
  [3.3.3], [Gợi ý sửa lỗi], [AA], [✅ Đạt],
  [3.3.7], [Không nhập lại thông tin thừa (mới WCAG 2.2)], [A], [✅ Đạt],
  [3.3.8], [Xác thực truy cập dễ dàng (mới WCAG 2.2)], [AA], [✅ Đạt],
  [4.1.2], [Tên, vai trò, giá trị của thành phần UI], [A], [✅ Đạt],
  [4.1.3], [Thông báo trạng thái qua aria-live], [AA], [✅ Đạt],
)
