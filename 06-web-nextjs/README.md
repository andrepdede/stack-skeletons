# 06 – Next.js (App Router) + TanStack Query + TypeScript
Maps your React+Vite+Node setup to Next.js:
- `app/page.tsx` (Server Component) = a route; `'use client'` files = your usual React components.
- `app/api/*/route.ts` = your Fastify/Express routes (same server, no separate back-end for small cases).
- `providers.tsx` = where React Query/Zustand providers go (client boundary).
- For a separate API (your Node service), keep calling it with `fetch`; Next.js does not force you to merge back-ends.
Run: `npm i && npm run build` (and `npm run dev`). Competitor you already use: React + Vite.
