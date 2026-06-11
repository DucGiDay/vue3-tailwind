# Tiêu chuẩn dự án (Project Rules & Conventions)

Các quy tắc dưới đây có thể không gây lỗi hệ thống ngay lập tức nếu bạn bỏ qua, nhưng **BẮT BUỘC** phải tuân thủ để đảm bảo code được chuẩn hóa, dễ đọc, đồng nhất và thuận tiện cho việc làm việc nhóm, bảo trì.

## 1. Tận dụng Auto Imports (Tránh import thủ công)
Dự án đã cấu hình plugin `unplugin-auto-import` và `unplugin-vue-components`. Không cần thiết import thủ công những module đã được hỗ trợ:
- **Vue Composition API**: Các hàm như `ref`, `reactive`, `computed`, `watch`, `onMounted`,... đã tự động import.
- **Dịch đa ngôn ngữ (i18n)**: Hàm `$t` đã tự động import từ `@/common/i18n/index`. Bạn có thể dùng `$t('key')` trực tiếp.
- **Global Components**: Toàn bộ component trong `src/components/Common` và UI components của **PrimeVue** đã tự động resolve. 
- ❌ **Sai**: `import { ref } from 'vue'; import Button from 'primevue/button';`
- ✅ **Đúng**: Dùng trực tiếp `ref` và thẻ `<Button />` không cần lệnh import.

## 2. Styling và Design System
- **Tailwind & PrimeUI làm gốc**: Hạn chế tối đa viết CSS/SCSS thuần. Hãy sử dụng class của Tailwind (`fb-...`) và component của PrimeVue để lên layout.
- **Đơn vị đo lường (Units)**: Bắt buộc sử dụng đơn vị `rem` (tuyệt đối không dùng `px`) cho các kích thước như font-size, margin, padding, width, height... để đảm bảo giao diện có thể scale và responsive tốt.
- **Sử dụng Bảng Màu Chuẩn**: Phải dùng màu trong `tailwind.config.cjs` (`primary`, `brand`, `error`, `gray`, `success`, `warning`).
  - ❌ **Sai**: `color: #0560A6;` hoặc `class="fb-text-[#0560A6]"`
  - ✅ **Đúng**: `class="fb-text-primary"`
- **Theme**: Sử dụng theme **Aura** của PrimeUI. Tùy biến theme tại `./src/theme/my-design-preset.js`.
- **SCSS Variables**: File `_variables.scss` (`@/assets/styles/scss/`) được inject tự động. Bạn có thể sử dụng biến ở mọi file SCSS mà không cần `@import`.

## 3. Cấu trúc thư mục (Folder Structure)
- `@/components/Common`: **CHỈ** dùng cho các UI component dùng chung toàn dự án. Component đặc thù của page nào thì phải nằm trong thư mục của page đó.
- `@/views`: Nơi chứa code cho các trang và luồng nghiệp vụ.
- `@/common/i18n`: Cấu hình đa ngôn ngữ.

## 4. Linting & Formatting
- **Linter**: Dự án sử dụng ESLint + Prettier. Hãy chắc chắn IDE của bạn tự động format theo Prettier. Bắt buộc dọn dẹp các cảnh báo rác như biến không dùng (`no-unused-vars`) trước khi tạo Merge Request.
- **Javascript Quotes**: Dùng **Single Quotes** (`'...'`) trong các file JS/TS.

## 5. Cú pháp Vue 3 (Composition API)
- **Script Setup**: Bắt buộc dùng cú pháp `<script setup>` trong các file `.vue`.
- **Tránh Options API**: Không sử dụng `data()`, `methods()`, `computed:{}` kiểu cũ của Vue 2 để đảm bảo kiến trúc dự án đồng bộ hoàn toàn theo Composition API.
