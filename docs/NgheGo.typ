#set document(
  title: "NgheGo — Nền tảng học tiếng Anh đạt chuẩn WCAG 2.2",
  author: "Nhóm phát triển NgheGo",
)

#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.8cm, right: 2.5cm),
  numbering: "1",
  number-align: center,
)

#set text(
  font: "Roboto",
  size: 11pt,
  lang: "vi",
  hyphenate: false,
)

#set par(
  justify: true,
  leading: 0.75em,
  spacing: 1.2em,
)

#set heading(numbering: "1.1.")

#show heading.where(level: 1): it => {
  v(1.5em)
  block(
    fill: rgb("#0f172a"),
    inset: (x: 14pt, y: 10pt),
    radius: 6pt,
    width: 100%,
    text(fill: white, weight: "bold", size: 13pt, it),
  )
  v(0.6em)
}

#show heading.where(level: 2): it => {
  v(1em)
  text(weight: "bold", size: 11.5pt, fill: rgb("#1e40af"), it)
  v(0.3em)
  line(length: 100%, stroke: 0.5pt + rgb("#bfdbfe"))
  v(0.4em)
}

#show heading.where(level: 3): it => {
  v(0.6em)
  text(weight: "bold", size: 11pt, fill: rgb("#374151"), it)
  v(0.2em)
}

#let badge(content, color) = box(
  fill: color,
  inset: (x: 8pt, y: 3pt),
  radius: 4pt,
  text(fill: white, weight: "bold", size: 9pt, content),
)

#let callout(title, content, accent: rgb("#1e40af")) = block(
  width: 100%,
  inset: 0pt,
  radius: 6pt,
  clip: true,
  stack(
    dir: ttb,
    block(
      fill: accent,
      width: 100%,
      inset: (x: 12pt, y: 7pt),
      text(fill: white, weight: "bold", size: 10pt, title),
    ),
    block(
      fill: accent.lighten(90%),
      width: 100%,
      inset: (x: 12pt, y: 10pt),
      stroke: (left: 3pt + accent),
      content,
    ),
  ),
)

#let wcag-row(principle, criterion, level, implementation) = (
  principle,
  criterion,
  badge(level, if level == "A" { rgb("#16a34a") } else if level == "AA" { rgb("#1e40af") } else { rgb("#7c3aed") }),
  implementation,
)

#page(numbering: none)[
  #v(2cm)

  #align(center)[
    #block(
      fill: rgb("#0f172a"),
      width: 100%,
      inset: (x: 0pt, y: 40pt),
      radius: 12pt,
    )[
      #text(fill: rgb("#c8ff00"), size: 36pt, weight: "black")[NgheGo]
      #v(0.3em)
      #text(fill: white, size: 14pt, style: "italic")[
        Nền tảng luyện nghe gõ chính tả tiếng Anh với video YouTube
      ]
    ]

    #v(1.5cm)

    #text(size: 15pt, weight: "bold", fill: rgb("#1e40af"))[
      TÀI LIỆU MÔ TẢ DỰ ÁN
    ]
    #v(0.3em)
    #text(size: 12pt, fill: rgb("#374151"))[
      Cuộc thi Thiết kế Website đạt chuẩn WCAG 2.2
    ]

    #v(2cm)

    #block(
      stroke: 1pt + rgb("#e2e8f0"),
      radius: 8pt,
      inset: 24pt,
      width: 85%,
    )[
      #grid(
        columns: (1fr, 1fr),
        gutter: 16pt,
        align(left)[
          #text(size: 9pt, fill: rgb("#6b7280"))[PHIÊN BẢN WCAG]
          #v(4pt)
          #badge("WCAG 2.2 — Cấp AA", rgb("#1e40af"))
        ],
        align(left)[
          #text(size: 9pt, fill: rgb("#6b7280"))[LĨNH VỰC]
          #v(4pt)
          #text(weight: "semibold")[Giáo dục — EdTech]
        ],

        align(left)[
          #text(size: 9pt, fill: rgb("#6b7280"))[CÔNG NGHỆ]
          #v(4pt)
          #text(weight: "semibold")[Nuxt 4 · PostgreSQL · Upstash]
        ],
        align(left)[
          #text(size: 9pt, fill: rgb("#6b7280"))[ĐỐI TƯỢNG]
          #v(4pt)
          #text(weight: "semibold")[Người học tiếng Anh A1–C2]
        ],
      )
    ]

  ]
]

#page(numbering: none)[
  #heading(level: 1, numbering: none)[Tóm tắt]

  NgheGo là nền tảng luyện nghe và gõ chính tả Tiếng Anh dựa trên nội dung video YouTube. Hệ thống tự động lập chỉ mục, tách câu, đồng bộ Transcript và tạo luồng luyện tập theo câu để người học nghe, gõ lại và nhận phản hồi tức thì. Người dùng có thể luyện tập ngay không cần đăng nhập, sau đó đồng bộ tiến độ khi cần.

  Điểm nhấn của dự án nằm ở trang Practice: toàn bộ thao tác có thể thực hiện bằng bàn phím, phím tắt được thiết kế theo luồng luyện tập và hiển thị ngay trong giao diện. Các thành phần tương tác có focus rõ ràng, trạng thái được thông báo qua trợ năng, và nội dung được tổ chức theo chuẩn WCAG 2.2 mức AA.
]

#page(numbering: none)[
  #outline(title: [Mục lục], depth: 2)
]

= Giới thiệu dự án

== Tổng quan

*NgheGo* là nền tảng học Tiếng Anh trực tuyến cho phép người dùng luyện nghe và gõ chính tả (Dictation) thông qua các video YouTube thực tế. Thay vì sử dụng nội dung học thuật khô khan, NgheGo tận dụng kho nội dung phong phú từ YouTube: Âm nhạc, tin tức, bài giảng, podcast. Để tạo ra trải nghiệm học tập tự nhiên, sinh động và hiệu quả.

Người dùng có thể dán link YouTube bất kỳ hoặc chọn từ thư viện video được phân loại theo trình độ CEFR (A1 đến C2). Hệ thống tự động lấy Transcript, tách thành từng câu, cho phép người học lắng nghe, gõ lại và nhận phản hồi tức thì theo từng từ. Không yêu cầu đăng nhập để bắt đầu luyện tập, giảm thiểu rào cản tiếp cận cho mọi đối tượng.

#callout(
  "Điểm khác biệt cốt lõi",
  [NgheGo sử dụng *Vercel Workflow SDK* để xử lý video bất đồng bộ, tự động lấy Transcript, phân tích độ khó, phân loại chủ đề và lưu vào database. Người dùng có thể dán bất kỳ link YouTube nào và bắt đầu luyện tập trong vài giây. Toàn bộ hệ thống được thiết kế tuân thủ *WCAG 2.2 cấp AA*, đảm bảo người học khuyết tật có thể tiếp cận đầy đủ các tính năng.],
  accent: rgb("#1e40af"),
)

== Mục tiêu dự án

#grid(
  columns: (1fr, 1fr),
  gutter: 12pt,
  block(
    stroke: 1pt + rgb("#e2e8f0"),
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    *Mục tiêu giáo dục*
    #v(4pt)
    - Cải thiện kỹ năng nghe và gõ chính tả Tiếng Anh
    - Hỗ trợ người học chuẩn bị IELTS, TOEIC
    - Tăng cường từ vựng qua ngữ cảnh thực tế
    - Theo dõi tiến độ học tập theo thời gian
  ],
  block(
    stroke: 1pt + rgb("#e2e8f0"),
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    *Mục tiêu tiếp cận*
    #v(4pt)
    - Đạt chuẩn WCAG 2.2 mức AA toàn bộ
    - Tương thích với trình đọc màn hình
    - Điều hướng hoàn toàn bằng bàn phím
    - Hỗ trợ người dùng mọi nhóm khuyết tật
  ],
)

== Đối tượng người dùng

Dự án hướng đến *ba nhóm người dùng chính*:

+ *Người học Tiếng Anh phổ thông* (16–35 tuổi): Học sinh, sinh viên và người đi làm muốn cải thiện kỹ năng nghe nói Tiếng Anh qua nội dung yêu thích.

+ *Người dùng khuyết tật*: Bao gồm người khiếm thị (sử dụng trình đọc màn hình), người khiếm thính (cần phụ đề song ngữ) và người hạn chế vận động (điều hướng bằng bàn phím hoặc thiết bị thay thế).

+ *Người cao tuổi và người ít kinh nghiệm công nghệ*: Giao diện đơn giản, ngôn ngữ rõ ràng, không yêu cầu đăng nhập để bắt đầu.

= Tính năng hệ thống

== Nhóm 1: Nội dung & Video

#table(
  columns: (2fr, 5fr),
  stroke: 0.5pt + rgb("#e2e8f0"),
  fill: (col, row) => if row == 0 { rgb("#f8fafc") } else { white },
  inset: 10pt,
  [*Tính năng*], [*Mô tả*],
  [Thư viện video YouTube],
  [Kho video được phân loại theo cấp độ CEFR (A1–C2), chủ đề và thời lượng. Mỗi video có Transcript được xử lý tự động và lưu trữ sẵn trong database.],

  [Dán link YouTube tức thì],
  [Người dùng dán link Youtube bất kì, hệ thống tự động lấy Transcript, phân tích độ khó, phân loại chủ đề và tạo bài dictation trong vài giây thông qua Vercel Workflow.],

  [Dictation theo câu],
  [Hệ thống tách Transcript thành từng câu với timestamp chính xác. Người học nghe và gõ lại, nhận phản hồi tức thì theo từng từ bằng trạng thái và biểu tượng rõ ràng.],

  [Phụ đề đồng bộ],
  [Hiển thị phụ đề Tiếng Anh đồng bộ với audio, có thể bật/tắt bằng bàn phím. Transcript đầy đủ luôn hiển thị bên cạnh player.],

  [Gợi ý thông minh],
  [Hệ thống gợi ý chữ cái đầu của từ khi người học gặp khó khăn, giúp tiếp tục luyện tập mà không bị kẹt.],

  [Theo dõi tiến độ],
  [Lưu lại từng lần thử (attempt) trên mỗi câu, tính độ chính xác, số lần gợi ý sử dụng và thời gian hoàn thành. Hỗ trợ nhiều phiên luyện tập trên cùng một video.],
)

== Nhóm 2: Người dùng & Gamification

#table(
  columns: (2fr, 5fr),
  stroke: 0.5pt + rgb("#e2e8f0"),
  fill: (col, row) => if row == 0 { rgb("#f8fafc") } else { white },
  inset: 10pt,
  [*Tính năng*], [*Mô tả*],
  [Xác thực Google OAuth],
  [Đăng nhập bằng tài khoản Google thông qua Better Auth. Email/password authentication bị vô hiệu hóa để đơn giản hóa quy trình.],

  [Luyện tập không cần đăng nhập],
  [Người dùng có thể bắt đầu luyện tập ngay lập tức mà không cần tạo tài khoản. Tiến độ được lưu local và có thể đồng bộ sau khi đăng nhập.],

  [Lịch sử luyện tập chi tiết],
  [Ghi lại từng phiên luyện (practice session), từng lần thử (practice attempt) trên mỗi câu, kèm độ chính xác, số gợi ý sử dụng và thời gian thực hành.],

  [Phân tích lỗi từ vựng],
  [Lưu từng từ sai cụ thể (word mistake) với vị trí, từ mong đợi và từ người dùng nhập, giúp phân tích điểm yếu và cải thiện.],

  [Quản trị viên],
  [Tài khoản admin có thể quản lý video, cập nhật metadata, xem thống kê sử dụng thông qua giao diện admin riêng biệt.],
)

== Trang Practice: Trải nghiệm luyện tập cốt lõi

Trang Practice được tối ưu cho thao tác liên tục, giảm nhiễu và hỗ trợ tối đa cho người dùng chỉ sử dụng bàn phím:

- Luồng luyện tập theo câu với điều khiển phát lại, bỏ qua và kiểm tra đáp án ngay trong ô nhập
- Phím tắt theo ngữ cảnh giúp thao tác không rời tay khỏi bàn phím (Meta = Ctrl trên Windows/Cmd trên Mac)
- Tổ hợp chính: Meta + Enter (kiểm tra), Meta + J/K (điều hướng), Meta + R (phát lại), Meta + H (gợi ý), Meta + S (bỏ qua), Ctrl + I (focus ô nhập)
- Trạng thái luyện tập hiển thị rõ ràng, có thông báo trợ năng và thứ tự focus nhất quán
- Tiến độ, độ chính xác và gợi ý được cập nhật theo thời gian thực

= Kiến trúc kỹ thuật

== Stack công nghệ

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 10pt,
  block(
    fill: rgb("#f0f9ff"),
    stroke: 1pt + rgb("#bae6fd"),
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    *Frontend*
    #v(4pt)
    - Nuxt 4
    - Vue 3
    - TypeScript
    - Nuxt UI 4
    - Tailwind CSS v4
    - VueUse
    - Motion-v
  ],
  block(
    fill: rgb("#f0fdf4"),
    stroke: 1pt + rgb("#bbf7d0"),
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    *Backend*
    #v(4pt)
    - Nuxt Server API
    - Better Auth
    - Drizzle ORM
    - PostgreSQL (Neon)
    - Upstash Redis
    - Vercel Workflow
  ],
  block(
    fill: rgb("#fefce8"),
    stroke: 1pt + rgb("#fde68a"),
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    *Infrastructure*
    #v(4pt)
    - Vercel (Deploy)
    - NuxtHub
    - Upstash KV
    - youtube-transcript-plus
    - Natural (NLP)
  ],
)

== Cơ sở dữ liệu

Hệ thống sử dụng PostgreSQL (Neon serverless) với Drizzle ORM, thiết kế theo mô hình cho phép lưu trữ lịch sử nhiều lần thử trên cùng một video:

- *video*: Lưu metadata video (title, youtubeId, duration, topic, level, thumbnailUrl)
- *video_transcript_sentence*: Từng câu trong transcript kèm timestamp (startTime, endTime) tính bằng milliseconds
- *practice_session*: Phiên luyện tập của người dùng, mỗi video có thể có nhiều session, lưu vị trí câu hiện tại và trạng thái hoàn thành
- *practice_attempt*: Kết quả từng lần gõ một câu, lưu văn bản người dùng nhập, độ chính xác (0-100), số lần gợi ý sử dụng
- *word_mistake*: Từng từ sai cụ thể với vị trí, từ mong đợi và từ người dùng nhập để phân tích lỗi chi tiết

Ngoài ra, Better Auth tự động tạo các bảng xác thực: *user*, *session*, *account*, *verification* thông qua Drizzle adapter.

= Thiết kế đạt chuẩn WCAG 2.2

NgheGo được thiết kế tuân thủ bốn nguyên tắc POUR của WCAG 2.2 ở mức *Cấp AA*. Phần này trình bày cách từng nguyên tắc được triển khai cụ thể trong sản phẩm.

== Nguyên tắc 1: Perceivable: Có thể nhận biết được

Mọi thông tin và thành phần giao diện phải được trình bày theo cách người dùng có thể cảm nhận được, bất kể họ sử dụng giác quan nào.

=== 1.1 Văn bản thay thế cho nội dung phi văn bản

Tất cả hình ảnh, biểu tượng và thumbnail video đều có thuộc tính `alt` mô tả đầy đủ nội dung. Biểu tượng trang trí (decorative icons) sử dụng `aria-hidden="true"` để trình đọc màn hình bỏ qua. Ví dụ: thumbnail video có alt text dạng _"Thumbnail video: [tên video] — Cấp độ B1"_.

=== 1.2 Phụ đề và bản ghi cho nội dung đa phương tiện

Đây là tính năng trọng tâm của NgheGo và cũng là yêu cầu WCAG quan trọng nhất với ứng dụng học ngôn ngữ:

- *Phụ đề tiếng Anh* hiển thị đồng bộ với audio, có thể bật/tắt bằng bàn phím
- *Transcript đầy đủ* của mỗi video luôn hiển thị bên cạnh player, cho phép người dùng khiếm thính theo dõi nội dung không cần âm thanh
- *Timestamp chính xác* cho từng câu (startTime, endTime tính bằng milliseconds) đảm bảo đồng bộ hoàn hảo
- Phụ đề hỗ trợ *điều chỉnh font size* và *tương phản* theo sở thích người dùng

=== 1.3 Thông tin không chỉ dựa vào tín hiệu thị giác

Phản hồi kết quả dictation sử dụng kết hợp biểu tượng và văn bản, đảm bảo người dùng không cần dựa vào dấu hiệu thị giác đơn lẻ để hiểu trạng thái:
- Từ đúng hiển thị nhãn trạng thái và biểu tượng xác nhận
- Từ sai hiển thị nhãn trạng thái và dấu hiệu phân biệt
- Cấp độ CEFR hiển thị chữ (A1, B2...) rõ ràng

=== 1.4 Tương phản và nhận diện thành phần

Tất cả trạng thái tương tác (hover, focus, lỗi, thành công) được thiết kế với tương phản đủ rõ, dễ nhận diện và không phụ thuộc vào một kênh thị giác đơn lẻ. Văn bản, biểu tượng và nhãn trợ giúp luôn đảm bảo khả năng đọc ở mọi kích thước màn hình, kể cả khi phóng to 200%.

== Nguyên tắc 2: Operable: Có thể vận hành được

Mọi chức năng phải có thể thao tác bằng nhiều phương thức nhập liệu khác nhau.

=== 2.1 Điều hướng hoàn toàn bằng bàn phím (trọng tâm: trang Practice)

NgheGo được thiết kế để người dùng có thể thực hiện *toàn bộ quy trình học tập chỉ bằng bàn phím*:

#table(
  columns: (2fr, 4fr),
  stroke: 0.5pt + rgb("#e2e8f0"),
  fill: (col, row) => if row == 0 { rgb("#f8fafc") } else { white },
  inset: 9pt,
  [*Phím tắt*], [*Chức năng*],
  [`Meta + Enter`], [Kiểm tra đáp án trong khi vẫn ở ô nhập (Meta = Cmd/Win)],
  [`Meta + J`], [Chuyển câu sau],
  [`Meta + K`], [Chuyển câu trước],
  [`Meta + R`], [Phát lại câu hiện tại],
  [`Meta + H`], [Gợi ý chữ cái đầu],
  [`Meta + S`], [Bỏ qua câu hiện tại],
  [`Ctrl + I`], [Đưa focus về ô nhập nhanh],
  [`Tab`], [Chuyển focus giữa các thành phần],
)

Các phím tắt hoạt động trực tiếp trong ô nhập, giúp người dùng không cần rời tay khỏi bàn phím. Phím tắt được hiển thị ngay trên các nút hành động để người dùng học nhanh và ghi nhớ theo ngữ cảnh. Tất cả các phần tử tương tác đều có `focus indicator` rõ ràng với viền dày, đảm bảo người dùng luôn biết focus đang ở đâu (tiêu chí 2.4.11, 2.4.12 — mới trong WCAG 2.2).

=== 2.2 Không giới hạn thời gian bắt buộc

- Không có giới hạn thời gian trả lời cho mỗi câu dictation
- Phiên luyện tập được lưu tự động, có thể tiếp tục bất cứ lúc nào
- Các cảnh báo phiên hết hạn xuất hiện ít nhất 60 giây trước và cho phép gia hạn

=== 2.3 Không có nội dung gây co giật

Không sử dụng hiệu ứng nhấp nháy với tần số trên 3 lần/giây. Animation chỉ dùng `prefers-reduced-motion` media query để tắt khi người dùng yêu cầu.

=== 2.4 Điều hướng rõ ràng và nhất quán

- Skip link "Chuyển đến nội dung chính" xuất hiện khi nhấn Tab lần đầu, đưa focus trực tiếp vào vùng luyện tập
- Tiêu đề trang (`<title>`) mô tả rõ nội dung từng trang
- Breadcrumb điều hướng nhất quán trên mọi trang
- Kích thước vùng nhấn tối thiểu 24×24px (tiêu chí 2.5.8 — mới trong WCAG 2.2), nút quan trọng tối thiểu 44×44px

=== 2.5 Phương thức nhập liệu đa dạng

Tất cả chức năng kéo thả đều có thao tác thay thế bằng click/tap đơn giản (tiêu chí 2.5.7 — mới trong WCAG 2.2). Input dictation hỗ trợ cả bàn phím vật lý lẫn bàn phím ảo trên mobile.

== Nguyên tắc 3: Understandable: Có thể hiểu được

Nội dung và giao diện phải dễ hiểu và hoạt động theo cách có thể dự đoán được.

=== 3.1 Ngôn ngữ rõ ràng và đơn giản

- Thuộc tính `lang="vi"` trên thẻ `<html>`, phần nội dung tiếng Anh có `lang="en"` riêng biệt
- Thông báo lỗi viết bằng ngôn ngữ đơn giản, chỉ rõ vấn đề và cách khắc phục
- Hướng dẫn sử dụng ngắn gọn ở đầu mỗi tính năng mới
- Tooltip giải thích thuật ngữ kỹ thuật (CEFR, Shadowing, Dictation)

=== 3.2 Giao diện nhất quán và có thể đoán trước

- Navigation bar, footer và các thành phần lặp lại giữ nguyên vị trí trên mọi trang
- Các nút cùng chức năng có tên và biểu tượng nhất quán
- Không có redirect hoặc thay đổi ngữ cảnh tự động ngoài ý muốn người dùng

=== 3.3 Hỗ trợ tránh và sửa lỗi

- Form đăng ký có validation inline, hiển thị lỗi ngay khi blur khỏi trường
- Thông báo lỗi liên kết trực tiếp với trường bị lỗi bằng `aria-describedby`
- Xác thực đăng nhập sử dụng Google OAuth, không yêu cầu CAPTCHA nhận thức; người dùng vẫn có thể luyện tập mà không cần đăng nhập

== Nguyên tắc 4: Robust mạnh mẽ

Nội dung phải hoạt động đáng tin cậy trên nhiều tác nhân người dùng khác nhau, bao gồm công nghệ hỗ trợ.

=== 4.1 Mã nguồn hợp lệ và ngữ nghĩa rõ ràng

- HTML semantic: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>` được dùng đúng ngữ nghĩa
- Không có lỗi validation HTML theo W3C Markup Validator
- ARIA landmarks và roles chỉ dùng khi HTML semantic không đủ
- Tất cả `id` là duy nhất, tất cả thành phần tương tác có tên có thể truy cập được

=== 4.2 Tương thích với công nghệ hỗ trợ

NgheGo đã được kiểm thử với các tổ hợp trình đọc màn hình và trình duyệt phổ biến:

#table(
  columns: (2fr, 2fr, 2fr),
  stroke: 0.5pt + rgb("#e2e8f0"),
  fill: (col, row) => if row == 0 { rgb("#f8fafc") } else { white },
  inset: 9pt,
  [*Trình đọc màn hình*], [*Trình duyệt*], [*Kết quả*],
  [NVDA 2024.1], [Chrome, Firefox], [#badge("Đạt ✓", rgb("#16a34a"))],
  [JAWS 2024], [Chrome, Edge], [#badge("Đạt ✓", rgb("#16a34a"))],
  [VoiceOver (macOS)], [Safari], [#badge("Đạt ✓", rgb("#16a34a"))],
  [VoiceOver (iOS)], [Safari Mobile], [#badge("Đạt ✓", rgb("#16a34a"))],
  [TalkBack (Android)], [Chrome Mobile], [#badge("Đạt ✓", rgb("#16a34a"))],
)

= Tuyên bố tuân thủ

#callout(
  "Tuyên bố Tuân thủ Khả năng Tiếp cận (Accessibility Statement)",
  [
    *Tên sản phẩm:* NgheGo — Nền tảng luyện nghe chép chính tả tiếng Anh

    *Ngày tuyên bố:* Tháng 5 năm 2026

    *Tiêu chuẩn áp dụng:* Web Content Accessibility Guidelines (WCAG) 2.2, Cấp AA

    *Mức độ tuân thủ:* Tuân thủ đầy đủ (Full conformance)

    Chúng tôi cam kết đảm bảo NgheGo có thể tiếp cận được với mọi người dùng, bao gồm người khuyết tật, người cao tuổi và người dùng có nhu cầu đặc biệt. Chúng tôi liên tục cải tiến khả năng tiếp cận thông qua kiểm thử định kỳ và tiếp nhận phản hồi từ cộng đồng người dùng.

    *Liên hệ phản hồi:* Nếu bạn gặp bất kỳ khó khăn nào khi truy cập NgheGo, vui lòng liên hệ qua email để chúng tôi hỗ trợ và cải thiện.
  ],
  accent: rgb("#1e40af"),
)

#v(1em)

#callout(
  "Các tiêu chí mới trong WCAG 2.2 đã được triển khai",
  [
    NgheGo đặc biệt chú trọng đến 9 tiêu chí thành công mới được bổ sung trong WCAG 2.2 (so với WCAG 2.1):

    - *2.4.11* Focus không bị che (Tối thiểu) ✓
    - *2.4.12* Focus không bị che (Nâng cao) ✓
    - *2.4.13* Hình thức focus ✓
    - *2.5.7* Chuyển động kéo ✓
    - *2.5.8* Kích thước mục tiêu (Tối thiểu) ✓
    - *3.2.6* Điều hướng nhất quán ✓
    - *3.3.7* Nhập liệu dư thừa ✓
    - *3.3.8* Xác thực truy cập (Không phải ngoại lệ) ✓
    - *3.3.9* Xác thực truy cập (Không phải ngoại lệ — Nâng cao) ✓
  ],
  accent: rgb("#16a34a"),
)

#v(2em)
