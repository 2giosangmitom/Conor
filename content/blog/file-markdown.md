---
title: Cách dùng file Markdown
description: Có ai dùng GitHub mà vẫn không biết tệp với đuôi .md là gì không?
date: 2026-05-22
# image: /images/blog/Hello.jpg
tags:
  - Study
---

# Giới thiệu

**Bài viết này được `lucthienphong1120` viết trong repo `Markdown-syntax`**

`Markdown` là ngôn ngữ đánh dấu có cú pháp khá đơn giản và dễ hiểu, tạo thuận tiện cho việc chuyển đổi từ văn bản thuần sang `HTML`.

Thay vì dựa vào `HTML`, `Markdown` cho phép bạn định dạng văn bản mà trực quan hơn nhiều so với `HTML`.

Có thể bạn chưa biết: `Markdown` có thể được sử dụng tại [Github](https://github.com) và [Discord](https://discord.com).

> If you can, feel free to translate this repo into other languages, thanks!

> Tài liệu được viết tay bởi [Lục Thiên Phong](https://github.com/lucthienphong1120), để giúp bạn có thêm hiểu biết và làm chủ về Markdown.

# I. Sơ lược

## 1. MarkDown (Markup languages)

Sự thật là cái tên **"Markdown"** chính là một phép chơi chữ của từ **"Markup"**.

Mardown được sử dụng để xuất văn bản thô trên trình duyệt nhưng các ngôn ngữ đánh dấu khác lại có thể giao tiếp trực tiếp với máy tính. Đơn cử như `XML` là một ngôn ngữ đánh dấu văn bản mà cả con người lẫn máy móc có thể đọc được.

Một ngôn ngữ đánh dấu văn bản khác mà mọi người chắc hẳn ai học CNTT cũng biết vì độ nổi tiếng của nó, chính là `HTML`, `Markdown` không mang trong mình sứ mệnh **"Kẻ huỷ diệt HTML"** hay gì, mà mục đích của nó chính là làm đơn giản hoá việc đánh dấu văn bản và tăng cường tốc độ viết lách một cách đáng kể.

## 2. Một số trình soạn thảo Markdown

- Mac, Windows, và Linux
  - [Typora](https://typora.io/)
  - [MacDown](https://macdown.uranusjr.com/)
- Online
  - [StackEdit](https://stackedit.io/)
  - [Dillinger](https://dillinger.io/)
  - [Hashify](https://hashify.me/)
- Sau bài viết này, bạn có thể viết md mà không cần chuyển đổi
  - Notepad
  - Visual Studio Code
  - Visual Code
  - Notepad++
  - Vi,nano,...
  - Github,Discord,...

# II. Cách sử dụng

## 1. Văn bản thuần

### 1 Tiêu đề - Heading

Bạn có thể viết loại tiêu đề `<h1>, <h2>,... <h6>` bằng cách thêm các dấu # tương ứng vào đầu dòng.

Một dấu # tương đương với `<h1>`, hai dấu # tương đương với `<h2>` ...

Cú pháp:

```txt
# Tiêu đề loại 1
## Tiêu đề loại 2
### Tiêu đề loại 3
#### Tiêu đề loại 4
##### Tiêu đề loại 5
###### Tiêu đề loại 6
```

Kết quả:

# Tiêu đề loại 1

## Tiêu đề loại 2

### Tiêu đề loại 3

#### Tiêu đề loại 4

##### Tiêu đề loại 5

###### Tiêu đề loại 6

### 2. Đoạn văn - Paragraph

Để xuống dòng giữa các văn bản `<p>`, sử dụng một dòng trống để tách các dòng văn bản.

Cú pháp:

```txt
Đây là dòng 1

Đây là dòng 2
```

Kết quả:

Đây là dòng 1

Đây là dòng 2

### 3. Chữ in nghiêng - Italic

Để in nghiêng văn bản `<i>`, thêm một dấu \* hoặc dấu \_ trước và sau từ cần in nghiêng.

Cú pháp:

```txt
*Từ cần in nghiêng 1*

_Từ cần in nghiêng 2_
```

Kết quả:

_Từ cần in nghiêng 1_

_Từ cần in nghiêng 2_

### 4. Chữ in đậm - Bold

Để in đậm văn bản `<b>`, thêm hai dấu \* hoặc dấu \_ trước và sau từ cần in đậm.

Cú pháp:

```txt
**Từ cần in đậm 1**

__Từ cần in đậm 2__
```

Kết quả:

**Từ cần in đậm 1**

**Từ cần in đậm 2**

### 5. In đậm và in nghiêng

Đơn giản, bạn chỉ cần ba dấu \* hoặc dấu \_ trước và sau từ đó.

Cú pháp:

```txt
***Từ in đậm và in nghiêng 1***

___Từ in đậm và in nghiêng 2___
```

Kết quả:

**_Từ in đậm và in nghiêng 1_**

**_Từ in đậm và in nghiêng 2_**

### 6. Chữ gạch giữa - Strikethrough

Để tạo chữ gạch giữa, thêm 2 dấu ~ trước và sau từ đó.

Cú pháp:

```txt
~~Khuyến mại~~
```

Kết quả:

~~Khuyến mại~~

### 7. Code trong dòng - Inline Code

Để viết inline `<code>`, bạn dùng 2 dấu ` ở trước và sau từ đó.

Cú pháp:

```txt
`inline code`
```

Kết quả:

`inline code`

## 2. Các khối

### 1. Trích dẫn - Blockquote

Để tạo một `<blockquote>`, thêm dấu > vào trước mỗi dòng trích dẫn.

Cú pháp:

```txt
> Trích dẫn dòng 1

> Trích dẫn dòng 2
```

Kết quả:

> Trích dẫn dòng 1

> Trích dẫn dòng 2

### 2. Danh sách có thứ tự - Ordered List

Để tạo danh sách `<ol><li>`, bạn chỉ cần thêm các số, dấu chấm trước nội dung (dùng tab để phân cấp)

Cú pháp:

```txt
1. Mục thứ nhất
2. Mục thứ hai
3. Mục thứ ba
```

Kết quả:

1. Mục thứ nhất
2. Mục thứ hai
3. Mục thứ ba

### 3. Danh sách không có thứ tự - Unordered List

Để tạo danh sách `<ul><li>`, bạn chỉ cần thêm dấu \* hoặc - hoặc + trước nội dung (dùng tab để phân cấp)

Cú pháp:

```txt
- Mục thứ nhất
- Mục thứ hai
- Mục thứ ba
```

Kết quả:

- Mục thứ nhất
- Mục thứ hai
- Mục thứ ba

### 4. Khối lệnh - Block Code

Để viết 1 đoạn `<code>`, bạn dùng 3 dấu ` ở trước và sau đoạn đó (có thể thêm format ngôn ngữ đó).

Cú pháp:

![image](https://user-images.githubusercontent.com/90561566/160242871-aad90ad1-bd8d-4e5c-9146-3349fb7c8c98.png)

Kết quả:

```python
print("hello world")
```

### 5. Bảng - Table

Để tạo bảng `<table><tbody><tr><th><th>`, bạn chỉ cần ngăn cách bởi dấu | và cách đầu bảng với thân bảng bằng :--- (số dấu - tuỳ ý)

Cú pháp:

```txt
| Cột 1 | Cột 2 | Cột 3 | Cột 4 |
| :--- | :--- | :--- | :--- |
| A | B | C | D |
| E | F | G | H |
| I | K | L | M |
```

Kết quả

| Cột 1 | Cột 2 | Cột 3 | Cột 4 |
| :---- | :---- | :---- | :---- |
| A     | B     | C     | D     |
| E     | F     | G     | H     |
| I     | K     | L     | M     |

## 3. Đặc biệt

### 1. Đường kẻ ngang - Horizonal rules

Để tạo đường kẻ ngang, sử dụng ba dấu \* hoặc - hoặc \_ trên một dòng.

Cú pháp:

```txt
---
***
___
```

Kết quả:

---

---

---

### 2. Liên kết - Link

Để chèn trực tiếp, bạn có thể paste thẳng nó như bình thường.

Để dẫn liên kết `<a href="https://github.com">Github</a>`, bạn dùng `[text](link)`.

Cú pháp:

```txt
Trực tiếp: https://github.com/lucthienphong1120

Gián tiếp: [Github](https://github.com/lucthienphong1120)
```

Kết quả:

Trực tiếp: https://github.com/lucthienphong1120

Gián tiếp: [Github](https://github.com/lucthienphong1120)

### 3. Hình ảnh - Image

Để chèn trực tiếp, bạn có thể paste thẳng nó như bình thường.

Để dẫn ảnh `<img src="https://avatars.githubusercontent.com/u/583231 alt="Github">`, bạn dùng `![text](link ảnh)`.

Hoặc `![](link ảnh)` nếu không cần chữ khi hover.

Cú pháp:

```txt
![](https://avatars.githubusercontent.com/u/583231)
```

Kết quả:

![](https://avatars.githubusercontent.com/u/583231)

Để chèn liên kết vào ảnh `<a href="link"><img src="link ảnh" alt="chữ"></a>` thì chỉ cần kết hợp đúng cú pháp là được.

```txt
[ ![chữ](link ảnh) ] (link)
```

### 4. Biểu tượng cảm xúc - Icon

Phần này tuỳ vào nền tảng (Github, Discord, ...) có icon đó không, bạn ghi dấu : và tên icon.

Cú pháp:

![image](https://user-images.githubusercontent.com/90561566/160245877-ccf277ff-094f-482c-801b-4a8fe46471b7.png)

Kết quả:

👁️

> More information: https://github.com/lucthienphong1120/Github-Emojis

### 5. Checkbox

Để chèn `checkbox/checked` (thường dùng cho to do list trên github) thì ta đánh dấu như list và thêm 1 cặp ngoặc vuông.

Cú pháp:

```txt
- [ ] Checkbox
- [x] Checked
```

Kết quả:

- [ ] Checkbox
- [x] Checked

### 6. Escape markdown

Đôi khi bạn sẽ cần những kí hiệu trùng với cú pháp của markdown. Để phân biệt, bạn chỉ cần thêm dấu \ trước những kí hiệu đó là được.

Cú pháp:

```txt
\`hai dấu nháy\`

\*\*\*ba dấu sao hai bên\*\*\*
```

Kết quả:

\`hai dấu nháy\`

\*\*\*ba dấu sao hai bên\*\*\*

# III. Kết thúc

Hy vọng qua bài viết này, bạn sẽ không còn thấy Markdown khó nữa và sẽ nắm được cách dùng Markdown trong nhiều việc của mình hơn nhé.

Nếu thấy hay hãy đừng ngần ngại mà thả 1 sao cho tôi, chúc bạn 1 ngày làm việc thật tốt!

> Bạn có thể thoải mái đóng góp (contribute) hoặc liên kết (fork) dự án này.

> You are free to contribute or fork this repo.
