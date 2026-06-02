# Quy tắc & Hướng dẫn cho AI Assistant (Gemini) trong dự án fabi-cms-sub-vue3

## 1. Technology Stack (Ngăn xếp công nghệ)

- **Framework:** Vue.js 3.x (Composition API & `<script setup>`)
- **State Management:** Pinia
- **Routing:** Vue Router 4.x
- **UI Framework:** PrimeVue 4 & TailwindCSS
- **Micro-Frontend:** Qiankun (Chạy dưới dạng sub-app thông qua `vite-plugin-qiankun`)
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **CSS Preprocessor:** SCSS / TailwindCSS
- **Ngôn ngữ**: Dự án sử dụng **JavaScript** (không phải TypeScript). Tuyệt đối không tự tạo code TypeScript (`<script setup lang="ts">`). Nếu cần định nghĩa kiểu dữ liệu, hãy sử dụng JSDoc comments.

## 2. Coding Conventions & Best Practices (Quy ước code & Thực hành tốt nhất)

### Vue.js 3 (Composition API)

- **Bắt buộc sử dụng Composition API** với `<script setup>`. KHÔNG SỬ DỤNG Vue 2 Options API (`data`, `methods`, v.v.).
- Luôn định nghĩa rõ ràng `props` và `emits` thông qua `defineProps` và `defineEmits`.
- Giữ cho các components module hóa, có khả năng tái sử dụng và tuân thủ nguyên lý Đơn trách nhiệm (Single Responsibility).
- Ưu tiên sử dụng các tính năng sẵn có của Vue 3 như `ref`, `reactive`, `computed`, `watch`.
- **Naming Conventions**: Đặt tên component Vue theo chuẩn `PascalCase` (ví dụ: `SmartReport.vue`). Đặt tên file logic hoặc utility theo `camelCase`. Các class Tailwind tuân thủ chuẩn của Tailwind.

### State Management (Pinia)

- Sử dụng Pinia để quản lý state toàn cục.
- Cấu trúc các store theo từng module rõ ràng.
- Khuyến khích sử dụng cú pháp **Setup Store** (`defineStore('name', () => { ... })`) để đồng nhất với Composition API.

### UI & Styling

- Ưu tiên sử dụng các component của **PrimeVue** và các class tiện ích của **TailwindCSS** cho việc xây dựng layout và styling.
- Giới hạn custom CSS trong phạm vi component bằng cách dùng `<style scoped>` hoặc ưu tiên dùng class của Tailwind.
- Đảm bảo thiết kế luôn Responsive.
- Dự án sử dụng **PrimeVue 4 với TailwindCSS Plugin (`tailwindcss-primeui`)**. Khi styling cho các component của PrimeVue, hãy ưu tiên sử dụng class của Tailwind hoặc dùng tính năng `pt` (Pass Through) của PrimeVue thay vì viết CSS ghi đè.
- Không bao giờ sử dụng PrimeIcons

### Micro-Frontend (Qiankun) Context

- Lưu ý rằng ứng dụng này là một sub-application chạy bên trong host của **Qiankun**.
- **Tuyệt đối tránh việc làm bẩn (polluting)** đối tượng `window` toàn cục.
- Đường dẫn Route và đường dẫn tải resource tĩnh có thể cần phải điều chỉnh để phù hợp với base URL của sub-app.

### Code Quality & Linting (Chất lượng code)

- Tuân thủ chặt chẽ các cấu hình ESLint và Prettier hiện có của dự án.
- Khai báo biến rõ ràng bằng `const` hoặc `let` (không dùng `var`).
- Viết comment ngắn gọn, súc tích để giải thích cho những đoạn logic phức tạp.
- Tách biệt logic call API ra các file services riêng rẽ. Xử lý try/catch gọn gàng và sử dụng UI Toast/Notification để báo lỗi cho người dùng.

## 3. Workflow for Assistant (Luồng làm việc cho AI Assistant)

- Luôn xem xét bối cảnh (context) của các file hiện tại trước khi đề xuất chỉnh sửa.
- Ưu tiên chỉnh sửa trên các component hiện có hơn là tạo mới, trừ khi component mới có sự tách biệt rõ ràng về mặt chức năng.
- Khi sinh ra code, hãy cung cấp các đoạn code hoàn chỉnh, có thể chạy ngay (drop-in ready), không được lược bỏ các import hay cấu hình cần thiết (`// ... existing code`).
- Tập trung vào việc duy trì tính ổn định của codebase Vue 3 và tận dụng các công cụ/thực hành tốt nhất của hệ sinh thái Vue 3 hiện đại.
