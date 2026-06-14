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
    Conor
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

Conor là nền tảng học tiếng Anh thông qua kỹ thuật chép chính tả từ các video YouTube thực tế. Người học có thể lựa chọn đa dạng nội dung theo sở thích từ công nghệ, khoa học, giáo dục đến giải trí để luyện tập trực tiếp với tiếng Anh tự nhiên, bao gồm ngữ điệu, tốc độ nói, từ vựng và các biến thể ngôn ngữ trong bối cảnh thực tế. Mỗi câu luyện tập đều cung cấp phản hồi tức thì về độ chính xác và những gợi ý cụ thể để cải thiện.

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

Conor cho phép người dùng sử dụng trực tiếp video YouTube để tạo thành các bài luyện nghe chép chính tả.

Sau khi nhận liên kết video, hệ thống tự động:

- Phân tích nội dung video.
- Trích xuất và xử lý transcript.
- Chia nội dung thành từng câu luyện tập.
- Xác định chủ đề nội dung.
- Ước lượng cấp độ CEFR từ A1 đến C2.
- Tạo môi trường luyện tập với phản hồi tức thời.

Người học có thể luyện tập theo từng câu, nghe lại nhiều lần, nhận gợi ý khi cần thiết và theo dõi tiến độ học tập của mình.

#pagebreak()

= Triển khai tiêu chuẩn WCAG 2.2

== Phương pháp tiếp cận

Conor được phát triển với chú trọng vào khả năng tiếp cận và tính dễ sử dụng, đảm bảo tương thích với nhiều trình duyệt và công nghệ hỗ trợ.

Quá trình thiết kế và phát triển được thực hiện dựa trên bốn nguyên tắc của WCAG:

- Perceivable (Có thể nhận biết)
- Operable (Có thể vận hành)
- Understandable (Có thể hiểu)
- Robust (Vững chắc)

Mọi chức năng chính đều được đánh giá theo các nguyên tắc này trước khi đưa vào sử dụng.

== Perceivable - Có thể nhận biết

Conor bảo đảm mọi thông tin và trạng thái giao diện đều có thể nhận biết bất kể cách người dùng tiếp cận nội dung. Tương phản màu đáp ứng mức AA, và màu sắc không bao giờ là phương thức duy nhất truyền tải thông tin. Trên màn hình luyện tập, kết quả kiểm tra đáp án được thể hiện đồng thời bằng màu sắc, biểu tượng và văn bản — người dùng không phân biệt được màu vẫn nắm đầy đủ kết quả. Danh sách câu luyện tập cũng hiển thị ba trạng thái (đang thực hiện, đã hoàn thành, chưa hoàn thành) theo cách tương tự. Hình ảnh mang ý nghĩa đều có mô tả thay thế, và giao diện vẫn sử dụng hiệu quả khi phóng to hoặc thay đổi kích thước hiển thị.

=== Các tiêu chí WCAG liên quan

- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 1.4.1 Use of Color
- 1.4.3 Contrast (Minimum)
- 1.4.10 Reflow

== Operable - Có thể vận hành

Toàn bộ chức năng của Conor có thể sử dụng bằng bàn phím mà không cần chuột. Trên màn hình luyện tập — nơi người dùng đồng thời nghe, nhập liệu, điều hướng và theo dõi tiến độ — hệ thống cung cấp bộ phím tắt đầy đủ để thực hiện mọi thao tác mà không cần rời tay khỏi bàn phím. Skip navigation giúp bỏ qua các vùng lặp lại, focus luôn hiển thị rõ, không có bẫy bàn phím, không áp đặt giới hạn thời gian nhập liệu, và hiệu ứng chuyển động được giảm theo thiết lập hệ điều hành.

#pagebreak()

=== Hệ thống phím tắt

#v(0.2cm)
#align(center)[
  #table(
    columns: (1.5fr, 3.5fr),
    inset: 10pt,
    stroke: 0.5pt + rgb("#e5e7eb"),
    fill: (row, _) => if row == 0 { rgb("#f3f4f6") } else { none },
    align: (col, row) => if row == 0 { center } else { left },

    [#strong[Phím tắt]], [#strong[Chức năng]],

    [`Cmd + Enter`], [Kiểm tra đáp án],
    [`Cmd + J`], [Chuyển sang câu tiếp theo],
    [`Cmd + K`], [Quay về câu trước],
    [`Cmd + R`], [Phát lại câu hiện tại],
    [`Cmd + H`], [Hiển thị gợi ý],
    [`Cmd + S`], [Bỏ qua câu hiện tại],
    [`Ctrl + I`], [Di chuyển tới ô nhập liệu],
  )
]
#v(0.2cm)

=== Các tiêu chí WCAG liên quan

- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.1 Bypass Blocks
- 2.4.3 Focus Order
- 2.4.7 Focus Visible
- 2.5.3 Label in Name
- 2.5.8 Target Size (Minimum)

== Understandable - Có thể hiểu

Conor được thiết kế để giảm tải nhận thức và giúp người dùng dễ dự đoán hành vi của hệ thống. Điều hướng nhất quán giữa các trang, tên gọi chức năng rõ ràng, thao tác đơn giản, và tiến độ luyện tập luôn được hiển thị. Thông báo lỗi mô tả cụ thể vấn đề và hướng dẫn cách khắc phục.

Để hỗ trợ người dùng trình đọc màn hình Conor triển khai hệ thống announcer, kênh thông báo trạng thái chuyên dụng hoạt động song song với giao diện mà không can thiệp vào focus. Khi người dùng kiểm tra đáp án, chuyển câu hoặc hệ thống hoàn tất xử lý video, announcer đọc thông điệp tương ứng ngay lập tức đảm bảo người dùng khiếm thị nhận được phản hồi tương đương với người dùng quan sát trực tiếp trên màn hình.

=== Các tiêu chí WCAG liên quan

- 3.2.3 Consistent Navigation
- 3.2.4 Consistent Identification
- 3.3.1 Error Identification
- 3.3.2 Labels or Instructions

== Robust - Vững chắc

Conor sử dụng HTML ngữ nghĩa với cấu trúc heading hợp lý, cung cấp tên và vai trò rõ ràng cho mọi thành phần tương tác, và tương thích với các trình đọc màn hình phổ biến. Cùng với hệ thống announcer mô tả ở trên, các thông báo trạng thái được phát qua ARIA live regions để công nghệ hỗ trợ nhận biết kịp thời mà không yêu cầu người dùng chủ động truy vấn. Hệ thống được kiểm thử và duy trì hoạt động ổn định trên nhiều trình duyệt và thiết bị khác nhau.

=== Các tiêu chí WCAG liên quan

- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages
