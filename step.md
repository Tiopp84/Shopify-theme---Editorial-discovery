Đúng hướng rồi. Với mục tiêu **chuẩn bị 2 demo store cho 2 preset của cùng một Shopify theme để submit lên Shopify Theme Store**, bạn nên coi đây là 2 “showroom” độc lập của cùng một bộ code theme, không phải 2 project theme khác nhau.

Ảnh bạn gửi đang ở **Partner account settings** của Partner Dashboard. Tài khoản công ty mới lập như vậy không có vấn đề gì; bước tiếp theo của bạn không nằm ở trang Settings này mà là tạo **Dev Store** trong **Dev Dashboard**. Shopify hiện dùng Dev Store để build/test app và theme. ([Shopify][1])

## Trước hết: mô hình bạn cần sẽ là thế này

Giả sử theme của công ty tên là:

**Amazin Fashion**

và có 2 preset:

* **Preset 1 — Mode** → fashion / streetwear
* **Preset 2 — Atelier** → luxury / editorial

Thì nên làm:

```text
Shopify Partner / Company
│
├── Dev Store 1
│   └── demo-mode.myshopify.com
│       └── Amazin Fashion theme
│           └── Preset: Mode
│
└── Dev Store 2
    └── demo-atelier.myshopify.com
        └── Amazin Fashion theme
            └── Preset: Atelier
```

Đây là điều quan trọng vì Shopify yêu cầu **mỗi preset phải có ít nhất một demo store hoàn chỉnh**, và demo đó phải phù hợp với industry/catalog-size mà preset đăng ký. ([Shopify][2])

Từ năm 2025, Shopify còn thay đổi Theme Store để từng preset có thể được install riêng và kết quả cài đặt phải khớp với trải nghiệm mà demo store của preset đó quảng bá. ([Shopify][3])

---

# BƯỚC 1 — Vào đúng Dev Dashboard

Từ Partner account hiện tại của bạn, tìm phần:

**Development → Dev Dashboard**

hoặc vào khu vực developer của Partner account.

Trong Dev Dashboard, menu bên trái sẽ có:

```text
Apps
Stores
...
```

Chọn:

**Stores → Create store**

Theo tài liệu Shopify hiện tại, quy trình chính thức là:

```text
Dev Dashboard
→ Stores
→ Create store
→ đặt tên store
→ chọn plan/features
→ tạo
```

([Shopify][1])

### Không chọn Client Transfer Store

Bạn đang làm demo Theme Store, không phải xây store cho khách hàng.

Hai loại này khác nhau:

```text
Dev Store
→ phát triển/test theme và app
→ phù hợp với bạn

Client Transfer Store
→ build store cho khách
→ sau này transfer ownership cho merchant
```

Shopify hiện phân biệt khá rõ hai loại này. ([Shopify Help Center][4])

---

# BƯỚC 2 — Tạo Dev Store đầu tiên

Giả sử preset đầu tiên của bạn tên:

**Urban**

Bạn có thể đặt tên:

```text
ThemeName - Urban Demo
```

Ví dụ:

```text
Amazin - Urban Demo
```

Tên internal không quá quan trọng, miễn công ty dễ quản lý sau này.

Nếu Shopify hỏi plan cho Dev Store, thường bạn chỉ cần:

**Basic**

trừ khi theme của bạn có feature đặc biệt cần test trên plan cao hơn.

Shopify hiện cho Dev Store lựa chọn các cấu hình/plan phục vụ testing. ([Shopify][1])

Tạo xong bạn sẽ có một store dạng:

```text
something.myshopify.com
```

---

# BƯỚC 3 — Tạo Dev Store thứ hai

Làm lại đúng quy trình:

```text
Stores
→ Create store
```

Ví dụ:

```text
Amazin - Editorial Demo
```

Kết quả:

```text
Store 1
Amazin - Urban Demo

Store 2
Amazin - Editorial Demo
```

Từ đây trở đi, **đừng phát triển hai codebase riêng**.

Bạn vẫn chỉ nên có:

```text
1 repository
1 Shopify theme
2 presets
2 demo stores
```

Điều này sẽ giúp việc maintain theme sau này dễ hơn rất nhiều.

---

# BƯỚC 4 — Chuẩn bị preset trong theme

Trong code theme, bạn có thể có architecture đại loại:

```text
theme/
├── assets/
├── blocks/
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
├── locales/
├── sections/
├── snippets/
└── templates/
```

Hai preset **không nên là hai bản copy của theme**.

Preset phải thể hiện variation của cùng architecture:

```text
Preset A
Streetwear

Preset B
Editorial / Luxury
```

Khác nhau có thể nằm ở:

```text
Typography
Colors
Section configuration
Spacing
Product-card style
Collection layout
Header
Hero
Navigation
Image treatment
Animations
```

Nhưng vẫn dùng chung codebase.

---

# BƯỚC 5 — Push theme lên Demo Store 1

Tại project theme local:

```bash
cd your-theme
```

Login Shopify CLI nếu chưa login:

```bash
shopify auth login
```

Sau đó chạy:

```bash
shopify theme dev --store=STORE_1.myshopify.com
```

Ví dụ:

```bash
shopify theme dev --store=amazin-urban-demo.myshopify.com
```

Bạn có thể phát triển trực tiếp với store này.

Khi muốn upload một bản theme tồn tại lâu dài trên store:

```bash
shopify theme push --store=amazin-urban-demo.myshopify.com
```

---

# BƯỚC 6 — Configure preset 1

Vào:

**Online Store → Themes → Customize**

Sau đó setup toàn bộ homepage.

Ví dụ preset Streetwear:

```text
Announcement bar
↓
Header
↓
Large campaign hero
↓
Featured collection
↓
Editorial banner
↓
Product grid
↓
Image with text
↓
Lookbook
↓
Newsletter
↓
Footer
```

Đây không còn là giai đoạn “test theme” đơn thuần nữa.

Hãy xem nó như **website thật của một brand giả lập**.

Demo Theme Store cần có cảm giác:

> đây là một cửa hàng thật đang hoạt động.

---

# BƯỚC 7 — Tạo dữ liệu thật cho demo

Phần này rất quan trọng.

Đừng để:

```text
Example Product
Example Product 2
Test collection
Lorem ipsum
```

Hãy tạo một brand giả.

Ví dụ:

```text
Brand: NORTH/84

Category:
Men's contemporary streetwear
```

Products:

```text
Oversized Heavyweight Tee
Utility Cargo Trouser
Washed Zip Hoodie
Essential Tank
Boxy Logo Tee
Canvas Overshirt
```

Collections:

```text
New Arrivals
Essentials
Outerwear
T-Shirts
Bottoms
```

Navigation:

```text
Shop
New Arrivals
Collections
Lookbook
About
```

Bạn có thể dùng sản phẩm hư cấu, nhưng demo phải trông như một merchant thật.

---

# BƯỚC 8 — Product catalog phải khớp preset

Đây là một trong những điểm Shopify đang kiểm tra khá rõ.

Shopify yêu cầu:

> Demo store phải phù hợp với **primary industry** và **catalog size** mà preset khai báo.

([Shopify][5])

Ví dụ bạn đăng preset:

```text
Industry:
Clothing

Catalog size:
Medium
```

thì đừng làm demo chỉ có:

```text
4 products
```

Tương tự nếu preset nhắm đến:

```text
Jewelry
Small catalog
```

thì demo lại chứa:

```text
500 fashion products
```

cũng không hợp lý.

---

# BƯỚC 9 — Demo Store 2 không được chỉ đổi màu

Đây là lỗi tôi khuyên bạn đặc biệt tránh.

Ví dụ:

### Preset A

```text
black background
white text
Helvetica
```

### Preset B

```text
beige background
black text
Georgia
```

nhưng:

```text
same sections
same layout
same products
same images
```

→ về mặt commercial presentation, 2 preset gần như không có ý nghĩa.

Preset thứ hai nên cho thấy **một use case khác của architecture**.

Ví dụ:

### MODE

```text
Industry:
Streetwear

Visual direction:
Bold
Dense
High contrast

Homepage:
Product-first
```

### ATELIER

```text
Industry:
Luxury fashion

Visual direction:
Editorial
Whitespace
Large photography

Homepage:
Story-first
```

Code vẫn:

```text
1 theme
```

nhưng merchant nhìn vào sẽ hiểu:

> “Theme này có thể tạo ra nhiều loại brand khác nhau.”

---

# BƯỚC 10 — Push theme sang Demo Store 2

Dùng cùng repository:

```bash
shopify theme push --store=STORE_2.myshopify.com
```

Sau đó:

```text
Online Store
→ Themes
→ Customize
```

và configure theo preset thứ hai.

Không copy repository:

```text
theme-preset-a/
theme-preset-b/
```

Cách đó về lâu dài sẽ rất khó maintain.

---

# BƯỚC 11 — Bạn nên có cấu trúc development như này

Ở local:

```text
GitHub
│
└── amazin-theme
    │
    ├── main
    │
    ├── develop
    │
    └── feature/*
```

Shopify:

```text
Dev Store
│
├── Dev / QA store
│
├── Preset A demo
│
└── Preset B demo
```

Nếu team nhỏ, ngay lúc đầu bạn có thể chỉ cần:

```text
Preset A demo
Preset B demo
```

và dùng theme development copy trong mỗi store để test.

---

# BƯỚC 12 — Đừng publish code đang dev trực tiếp

Trong mỗi store, nên có:

```text
Live theme
    ↓
Demo version ổn định

Unpublished theme
    ↓
Development version
```

Workflow:

```text
Code local
      ↓
shopify theme dev
      ↓
Development Theme
      ↓
test
      ↓
theme push
      ↓
QA
      ↓
Publish
```

Như vậy bạn không phá demo URL đang được reviewer hoặc người khác xem.

---

# BƯỚC 13 — Hai demo store cuối cùng sẽ dùng ở đâu?

Khi submit Theme Store, mỗi preset có thông tin listing riêng.

Ví dụ:

```text
Theme: AMAZIN

Preset:
MODE

Industry:
Clothing

Catalog:
Medium

Demo store:
https://mode-demo...
```

và:

```text
Preset:
ATELIER

Industry:
Clothing

Catalog:
Small / Medium

Demo store:
https://atelier-demo...
```

Shopify yêu cầu **link tới một demo store đầy đủ và hoạt động cho từng preset**. ([Shopify][2])

---

# BƯỚC 14 — Những gì demo store nên hoàn thiện

Trước khi nghĩ đến submit, mỗi demo nên có ít nhất:

```text
Home
Collection
Product
Cart
Search
Blog
Article
About / content page
Contact
404
Password page
```

và các state:

```text
Product available

Product sold out

Product variants

Sale price

Empty cart

Cart with products

Search results

Search empty

Collection filters

Pagination

Predictive search

Mobile navigation
```

Ngoài ra tôi sẽ test:

```text
320px
375px
390px
768px
1024px
1440px
1920px
```

---

# BƯỚC 15 — Một điểm rất quan trọng với công ty bạn

Trong screenshot của bạn tôi thấy Partner account đang đứng dưới organization:

**AMAZINPRO TECHNOLOGY SOLUTIONS AND TRAINING COMPANY LIMITED**

và đang ở:

```text
Partner account settings
```

Bạn **không cần đăng ký App Store** ở phần:

```text
APP STORE REGISTRATION
```

chỉ để làm Shopify Theme.

App Store registration là workflow dành cho Shopify App Store.

Bạn đang làm:

```text
Shopify Theme
        ↓
Shopify Theme Store
```

đó là một pipeline khác.

Vì vậy **đừng bấm Register now ở App Store Registration chỉ vì nghĩ rằng phải làm trước khi tạo theme demo**.

---

## Lộ trình tôi khuyên bạn làm ngay

Với tình trạng hiện tại, thứ tự tốt nhất là:

```text
HIỆN TẠI
   │
   ▼
Partner account
   │
   ├── 1. Vào Dev Dashboard
   │
   ├── 2. Stores
   │
   ├── 3. Create Dev Store
   │      └── Preset A Demo
   │
   ├── 4. Create Dev Store
   │      └── Preset B Demo
   │
   ├── 5. Push cùng theme lên cả 2
   │
   ├── 6. Configure Preset A
   │
   ├── 7. Configure Preset B
   │
   ├── 8. Tạo product / collection / menu / content
   │
   ├── 9. QA toàn bộ storefront
   │
   ├── 10. Check Theme Store requirements
   │
   └── 11. Submit Theme
```

**Bây giờ bạn mới nên làm tới bước 1–3, chưa cần đụng tới Theme Store submission.**

Nếu bạn gửi cho tôi **ảnh màn hình sau khi bạn vào `Stores → Create store`**, tôi có thể đi cùng bạn **từng trường một: chỗ nào chọn gì, vì sao chọn, store nào dùng cho preset 1 và store nào dùng preset 2**, để tránh ngay từ đầu tạo sai loại store.

[1]: https://shopify.dev/docs/apps/build/dev-dashboard/stores/development-stores?utm_source=chatgpt.com "Dev stores"
[2]: https://shopify.dev/docs/storefronts/themes/store/review-process/listings?utm_source=chatgpt.com "Theme Store listing page"
[3]: https://shopify.dev/changelog/theme-files-are-now-installable-at-the-preset-level-on-the-shopify-theme-store?utm_source=chatgpt.com "Theme files are now installable at the preset level on ..."
[4]: https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores?utm_source=chatgpt.com "Client transfer stores and collaborations"
[5]: https://shopify.dev/docs/storefronts/themes/store/requirements?utm_source=chatgpt.com "Theme store requirements"
