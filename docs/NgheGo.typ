#set text(font: "Noto Serif", size: 12pt, lang: "vi")
#set page(
  paper: "us-letter",
  margin: 2cm,
  numbering: "1",
)

#set par(justify: true, leading: 0.8em)
#set heading(numbering: "1.1.")

#align(center)[
  #text(size: 20pt, weight: "bold")[TÀI LIỆU DỰ THI]

  #v(0.3cm)

  #text(size: 17pt, weight: "bold")[
    CUỘC THI XÂY DỰNG WEBSITE/ỨNG DỤNG SỐ
    ĐẠT TIÊU CHUẨN TIẾP CẬN WCAG 2.2
  ]

  #v(0.5cm)

  #text(size: 18pt, weight: "bold", fill: rgb("#1d7a5b"))[
    NgheGo
  ]

  #v(0.2cm)

  #text(size: 12pt, style: "italic")[
    Ứng dụng web luyện nghe gõ chính tả tiếng Anh từ nội dung YouTube
  ]

  #v(0.6cm)

  #text(size: 11pt)[
    #strong[Thành viên:] Võ Văn Duy, Võ Quang Chiến, Nguyễn Gia Hưng
  ]
]

#pagebreak()

= Tổng quan

NgheGo là nền tảng học tiếng Anh thông qua kỹ thuật chép chính tả từ các video YouTube thực tế. Người học có thể lựa chọn đa dạng nội dung theo sở thích từ công nghệ, khoa học, giáo dục đến giải trí để luyện tập trực tiếp với tiếng Anh tự nhiên, bao gồm ngữ điệu, tốc độ nói, từ vựng và các biến thể ngôn ngữ trong bối cảnh thực tế. Mỗi câu luyện tập đều cung cấp phản hồi tức thì về độ chính xác và những gợi ý cụ thể để cải thiện.

Mục tiêu của sản phẩm không chỉ giúp người học nâng cao kỹ năng tiếng Anh mà còn kiến tạo một môi trường học tập số bình đẳng, nơi mọi người đều có cơ hội tiếp cận tri thức mà không bị rào cản bởi khả năng vận động, thị giác hay các giới hạn công nghệ khác.

= Giới thiệu sản phẩm

== Bối cảnh

Kỹ năng nghe là một trong những kỹ năng khó nhất khi học tiếng Anh. Mặc dù hiện nay có nhiều nền tảng học tập trực tuyến, nhưng phần lớn vẫn tồn tại một số hạn chế:

- Nội dung học tập cố định và khó cá nhân hóa.
- Người học khó tìm được chủ đề phù hợp với sở thích cá nhân.
- Thiếu phản hồi chi tiết trong quá trình luyện tập.
- Chưa chú trọng đầy đủ đến khả năng tiếp cận cho người khuyết tật.

Trong khi đó, YouTube sở hữu kho nội dung tiếng Anh phong phú và luôn được cập nhật. Tuy nhiên, việc chuyển đổi các video này thành tài liệu học tập có cấu trúc vẫn là một thách thức đối với phần lớn người học.

== Giải pháp

NgheGo cho phép người dùng sử dụng trực tiếp video YouTube để tạo thành các bài luyện nghe chép chính tả.

Sau khi nhận liên kết video, hệ thống tự động:

- Phân tích nội dung video.
- Trích xuất và xử lý transcript.
- Chia nội dung thành từng câu luyện tập.
- Xác định chủ đề nội dung.
- Ước lượng cấp độ CEFR từ A1 đến C2.
- Tạo môi trường luyện tập với phản hồi tức thời.

Người học có thể luyện tập theo từng câu, nghe lại nhiều lần, nhận gợi ý khi cần thiết và theo dõi tiến độ học tập của mình.

#pagebreak()

// == Công nghệ sử dụng

// NgheGo được phát triển trên nền tảng web hiện đại với các công nghệ chính:

// - Nuxt 4 và Vue 3 cho giao diện người dùng.
// - PostgreSQL phục vụ lưu trữ dữ liệu.
// - Better Auth cho xác thực người dùng.
// - TailwindCSS và Nuxt UI hỗ trợ xây dựng giao diện nhất quán.
// - Các thư viện xử lý ngôn ngữ tự nhiên phục vụ phân loại chủ đề và xác định cấp độ CEFR.

= Triển khai tiêu chuẩn WCAG 2.2

== Phương pháp tiếp cận

NgheGo được phát triển với chú trọng vào khả năng tiếp cận và tính dễ sử dụng, đảm bảo tương thích với nhiều trình duyệt và công nghệ hỗ trợ.

Quá trình thiết kế và phát triển được thực hiện dựa trên bốn nguyên tắc của WCAG:

- Perceivable (Có thể nhận biết)
- Operable (Có thể vận hành)
- Understandable (Có thể hiểu)
- Robust (Vững chắc)

Mọi chức năng chính đều được đánh giá theo các nguyên tắc này trước khi đưa vào sử dụng.

== Perceivable (Có thể nhận biết)

NgheGo bảo đảm nội dung và trạng thái giao diện có thể được nhận biết bởi nhiều nhóm người dùng khác nhau.

Các biện pháp đã triển khai gồm:

- Tương phản màu đáp ứng mức AA của WCAG 2.2.
- Không sử dụng màu sắc như phương thức duy nhất để truyền tải thông tin.
- Hình ảnh mang ý nghĩa đều có mô tả thay thế phù hợp.
- Các trạng thái đúng, sai, hoàn thành hoặc lỗi được thể hiện đồng thời bằng màu sắc, biểu tượng và văn bản.
- Giao diện vẫn sử dụng hiệu quả khi phóng to hoặc thay đổi kích thước hiển thị.
- Nội dung được trình bày rõ ràng, có cấu trúc và khoảng cách hợp lý.

Các tiêu chí WCAG liên quan:

- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 1.4.1 Use of Color
- 1.4.3 Contrast (Minimum)
- 1.4.10 Reflow

== Operable (Có thể vận hành)

Đây là nhóm tiêu chí được đầu tư nhiều nhất trong NgheGo.

Toàn bộ chức năng chính của hệ thống đều có thể sử dụng bằng bàn phím mà không yêu cầu chuột.

Các giải pháp nổi bật gồm:

- Hỗ trợ điều hướng hoàn toàn bằng bàn phím.
- Skip navigation giúp bỏ qua các vùng lặp lại.
- Hiển thị trạng thái focus rõ ràng.
- Không tạo bẫy bàn phím.
- Hỗ trợ thao tác trong hộp thoại và menu theo luồng focus hợp lý.
- Không áp đặt giới hạn thời gian trong quá trình nhập liệu.
- Hỗ trợ giảm hiệu ứng chuyển động theo thiết lập hệ điều hành.

=== Hệ thống phím tắt

#table(
  columns: (1fr, 2fr),
  inset: 8pt,
  stroke: 0.8pt + rgb("#e5e7eb"),
  fill: (row, _) => if row == 0 { rgb("#f9fafb") } else { none },

  [#strong[Phím tắt]], [#strong[Chức năng]],

  [`Cmd + Enter`], [Kiểm tra đáp án],
  [`Cmd + J`], [Chuyển sang câu tiếp theo],
  [`Cmd + K`], [Quay về câu trước],
  [`Cmd + R`], [Phát lại câu hiện tại],
  [`Cmd + H`], [Hiển thị gợi ý],
  [`Cmd + S`], [Bỏ qua câu hiện tại],
  [`Ctrl + I`], [Di chuyển tới ô nhập liệu],
)

Các tiêu chí WCAG liên quan:

- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.1 Bypass Blocks
- 2.4.3 Focus Order
- 2.4.7 Focus Visible
- 2.5.3 Label in Name
- 2.5.8 Target Size (Minimum)

== Understandable (Có thể hiểu)

NgheGo được thiết kế nhằm giảm tải nhận thức và giúp người dùng dễ dàng hiểu cách sử dụng.

Các biện pháp bao gồm:

- Điều hướng nhất quán giữa các trang.
- Tên gọi chức năng rõ ràng và dễ hiểu.
- Thông báo lỗi cụ thể, dễ nhận biết.
- Luồng thao tác đơn giản và có thể dự đoán.
- Tiến độ luyện tập luôn được hiển thị.
- Các nút chức năng và điều khiển được đặt tại vị trí quen thuộc.
- Cấu trúc nội dung theo phân cấp rõ ràng.

=== Hỗ trợ trình đọc màn hình với Announcer

NgheGo cung cấp một cơ chế announcer - kênh thông báo trạng thái dành cho trình đọc màn hình. Thay vì buộc người dùng phải chuyển focus hoặc đọc lại toàn bộ nội dung, announcer phát các thông điệp ngắn, rõ ràng để mô tả thay đổi giao diện và kết quả thao tác.

Các tính năng và lợi ích chính:

- Thông báo khi chuyển trang hoặc thay đổi ngữ cảnh (ví dụ: bắt đầu màn luyện tập).
- Thông báo kết quả kiểm tra đáp án và tóm tắt ngắn về độ chính xác.
- Thông báo trạng thái tiến trình xử lý (ví dụ: lập chỉ mục video, lỗi xử lý, hoàn tất).
- Thông báo lỗi, cảnh báo hoặc sự kiện cần chú ý.
- Hoạt động không can thiệp vào focus chính, giảm gián đoạn luồng thao tác của người dùng.
- Hỗ trợ các mức ưu tiên thông báo để điều chỉnh cách và tần suất đọc thông điệp.

Nhờ đó, người dùng sử dụng trình đọc màn hình nhận được phản hồi kịp thời, dễ hiểu và không bị gián đoạn — giúp trải nghiệm luyện tập sát với trải nghiệm của người dùng nhìn thấy giao diện.

Các tiêu chí WCAG liên quan:

- 3.2.3 Consistent Navigation
- 3.2.4 Consistent Identification
- 3.3.1 Error Identification
- 3.3.2 Labels or Instructions

== Robust (Vững chắc)

NgheGo được xây dựng nhằm bảo đảm khả năng tương thích với nhiều trình duyệt, thiết bị và công nghệ hỗ trợ.

Các giải pháp chính:

- Sử dụng HTML ngữ nghĩa.
- Duy trì cấu trúc heading hợp lý.
- Cung cấp tên và vai trò rõ ràng cho các thành phần tương tác.
- Hỗ trợ thông báo trạng thái cho công nghệ hỗ trợ.
- Tương thích với trình đọc màn hình phổ biến.
- Duy trì khả năng hoạt động ổn định trên nhiều môi trường khác nhau.

Các tiêu chí WCAG liên quan:

- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages

#pagebreak()

== Trường hợp điển hình: Màn hình luyện tập

Màn hình luyện tập là khu vực thể hiện rõ nhất việc áp dụng WCAG 2.2 trong NgheGo.

Đây là nơi người dùng đồng thời thực hiện nhiều hoạt động:

- Nghe nội dung.
- Nhập câu trả lời.
- Điều hướng giữa các câu.
- Theo dõi tiến độ.
- Nhận phản hồi tức thời.

Người dùng có thể hoàn thành toàn bộ quá trình luyện tập chỉ bằng bàn phím.

Khi kiểm tra đáp án, hệ thống cung cấp đồng thời:

- Phản hồi trực quan trên giao diện.
- Thông tin văn bản về kết quả.
- Thông báo trạng thái cho trình đọc màn hình.

Danh sách câu luyện tập cũng hiển thị rõ trạng thái:

- Đang thực hiện.
- Đã hoàn thành.
- Chưa hoàn thành.

Nhờ đó, người dùng khiếm thị hoặc người gặp khó khăn về vận động vẫn có thể học tập một cách độc lập và hiệu quả.

Trong quá trình luyện tập, NgheGo sử dụng hệ thống announcer để thông báo các sự kiện quan trọng cho trình đọc màn hình.

Khi người dùng kiểm tra đáp án, chuyển sang câu mới hoặc nhận phản hồi từ hệ thống, thông tin tương ứng sẽ được đọc tự động mà không làm gián đoạn luồng thao tác hiện tại.

Cơ chế này giúp người dùng khiếm thị có thể theo dõi tiến độ và kết quả luyện tập tương đương với người dùng quan sát trực tiếp trên giao diện.

== Kiểm thử và đánh giá

NgheGo được đánh giá bằng cả công cụ tự động và kiểm thử thủ công.

=== Công cụ đánh giá

#table(
  columns: (1.2fr, 2.8fr),
  inset: 8pt,
  stroke: 0.8pt + rgb("#e5e7eb"),
  fill: (row, _) => if row == 0 { rgb("#f9fafb") } else { none },

  [#strong[Công cụ]], [#strong[Mục tiêu đánh giá]],

  [axe DevTools], [Kiểm tra ARIA, cấu trúc ngữ nghĩa và khả năng điều hướng],
  [Lighthouse], [Đánh giá tổng thể khả năng tiếp cận],
)

#pagebreak()

=== Kiểm thử thủ công

- Điều hướng hoàn toàn bằng bàn phím.
- Kiểm thử với trình đọc màn hình.
- Kiểm tra khả năng phóng to giao diện.
- Đánh giá khả năng sử dụng khi không phụ thuộc màu sắc.
- Kiểm tra trên nhiều kích thước màn hình và thiết bị khác nhau.

Kết quả cho thấy hệ thống đáp ứng tốt các yêu cầu trợ năng cốt lõi và không phát hiện các vấn đề nghiêm trọng ảnh hưởng đến khả năng sử dụng.

// = Định hướng phát triển

// Trong thời gian tới, NgheGo dự kiến mở rộng theo các hướng:

// - Hỗ trợ thêm nhiều ngôn ngữ học tập.
// - Bổ sung chức năng đánh giá phát âm.
// - Cá nhân hóa lộ trình học tập bằng AI.
// - Phát triển ứng dụng di động với tiêu chuẩn trợ năng tương đương.
// - Mở rộng các kỹ năng học tập ngoài nghe và viết.
// - Tiếp tục nâng cao mức độ tuân thủ các tiêu chuẩn trợ năng quốc tế.

= Kết luận

NgheGo là một sản phẩm giáo dục số được xây dựng với mục tiêu kết hợp giữa hiệu quả học tập và khả năng tiếp cận.

Thông qua việc áp dụng các nguyên tắc của WCAG 2.2 ngay từ giai đoạn thiết kế, sản phẩm hướng tới việc tạo ra một môi trường học tập nơi mọi người đều có thể tiếp cận, tương tác và phát triển kỹ năng của mình một cách bình đẳng.

Chúng tôi tin rằng khả năng tiếp cận không chỉ là một yêu cầu kỹ thuật mà còn là nền tảng để xây dựng các sản phẩm số có trách nhiệm với cộng đồng.
