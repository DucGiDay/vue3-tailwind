# Fabi sub Vue 3 (Sub-app)

Dự án Micro-frontend (Sub-app) sử dụng Vue 3, Vite, Tailwind CSS, PrimeVue, Vue Router và Pinia.

## 🚨 BẮT BUỘC (MANDATORY) - KHÔNG LÀM THEO SẼ GÂY LỖI!

Những quy định dưới đây là **bắt buộc**. Nếu vi phạm, dự án sẽ bị lỗi khi build, lỗi runtime hoặc gây xung đột trực tiếp với giao diện của Host-app.

1. **Node.js Version**: 
   - Bắt buộc sử dụng **Node.js 22**.
   - Chạy lệnh `nvm use 22` trước khi thao tác lệnh `npm`.

2. **Tailwind CSS Prefix (Chống xung đột class)**:
   - Tất cả các utility class của Tailwind **bắt buộc** phải có tiền tố `fb-`.
   - ❌ **Sai**: `class="bg-primary text-white p-4"`
   - ✅ **Đúng**: `class="fb-bg-primary fb-text-white fb-p-4"`
   - *Lý do: Cấu hình `prefix: 'fb-'` trong `tailwind.config.cjs` được dùng để không gây xung đột với bộ CSS của Host-app (Vue 2).*

3. **CSS/SCSS Scoping (Chống tràn style)**:
   - Nếu phải viết CSS/SCSS tĩnh trong assets, chúng **bắt buộc** phải được bọc trong ID `#sub-app` hoặc sử dụng thẻ `<style scoped>` ở trong component.
   - Tuyệt đối không khai báo Global CSS thả nổi, vì style sẽ bị rò rỉ (leak) ra ngoài làm vỡ layout của hệ thống Host-app.

4. **Khai báo Router Độc Lập**:
   - Sub-app phải **tự quản lý và khai báo router đầy đủ**, không còn nhận và phụ thuộc vào router được truyền xuống từ Host-app (Fabi CMS Vue 2) nữa.
   - Mọi router cần được khai báo chi tiết (path, name, meta, component) trong các module thuộc thư mục `src/router`.

5. **Qiankun Micro-frontend Port**:
   - Cấu hình server port (`5173`), `allowedHosts` và plugin `qiankun` trong `vite.config.js` đã được thiết lập cứng. Không được tự ý thay đổi nếu không có yêu cầu cập nhật liên kết.

---

## 🚀 Cài đặt và Chạy dự án (Getting Started)

1. **Cài đặt thư viện**:
   ```bash
   nvm use 22
   npm install
   ```

2. **Khởi chạy môi trường Dev**:
   ```bash
   npm run dev
   ```

3. **Build dự án**:
   ```bash
   npm run build:site-dev      # Dành cho môi trường dev
   npm run build:site-product  # Dành cho môi trường production
   ```

---

## 📖 Tiêu chuẩn Code (Coding Standards)

Vui lòng đọc kỹ file [RULES.md](./RULES.md) để biết các tiêu chuẩn và quy ước (conventions) code được áp dụng. Đây là các quy chuẩn bắt buộc tuân theo để giữ source code đồng bộ và sạch sẽ.
