# Fabi sub Vue 3 (Sub-app) (Tailwind + Vue Router modular + Pinia)

# Fabi CMS Vue 2 (Host-app)

Quick starter project created for the user.

## Requirements

- Node.js 22

Features:

- Vue 3 + Vite
- Tailwind CSS
- Vue Router with modular route files under `src/router/modules` (user, report)
- Global auth guard: routes with `meta.requiresAuth` require `localStorage.token`
- Pinia store (simple `user` store with token helpers)

How to run

1. Install dependencies:

```bash
cd c:\Users\duc.hoang01\Documents\duc\ipos\projects\micro-cms\fabi-cms-sub-vue3
npm install
```

2. Start dev server:

```bash
npm run dev
```

Notes

- To protect routes, set a token in browser localStorage (or use the login page at `/login`).
- Tailwind is pre-configured via `tailwind.config.cjs` and `src/assets/tailwind.css`.

Next steps (optional):

- Add ESLint/Prettier, typescript, real auth flow, API clients, and tests.

## Note

1. Router:
- Router được truyền xuống từ Host-app thông qua props.
- Khai báo đường dẫn component được map bằng key 'name' của các router
```json
// Props truyền xuống
{
  // ...
  "children": [
    {
      "path": "report",
      "name": "MicroReport",
      // ...
      "children": [
        {
          "path": "sale-audit",
          "name": "SaleAudit",
          // ...
        }
      ]
    }
  ]
}
```

```js
// Khai báo map component
export const reportComponentMap = {
  // D05
  SaleAudit: () => import('@/views/micro-report/sale-audit/index.vue')
};
```
Lưu ý, sau khi chuyển toàn bộ report sang Vue 3, Tự quản lý router thay vì nhận router thông qua props

2. Styling:

- Các class của Tailwind được thêm prefix 'fb-' để không xung đột với các class của Host-app. Ví dụ:

```
'fb-bg-primary fb-text-white'
```

- Các CSS/SCSS trong assets được bọc trong #sub-app để không xung đột với các class của
- Màu của Tailwind được reset, thay bằng bảng màu trong tailwind.config.cjs
- Áp dụng theme Aura của PrimeUI, Có thể tùy biến trong './src/theme/my-design-preset.js'.
- variables SCSS './src/assets/layout/variables/...': Nơi khai báo các variable. Các variable '--p-...' được truy xuất từ theme của PrimeUI (aura | lara | nora), ta có thể tùy biến trong ./src/theme/my-design-preset.js
