# Vue 3 Starter (Tailwind + Vue Router modular + Pinia)

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
