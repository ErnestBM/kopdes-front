# Kopdes - Frontend

Next.js (App Router) frontend for the debt/credit tracking app. Talks to the `../backend`
REST API server-side only (Server Components & Server Actions) — no API calls happen
directly from the browser, so the session cookie set here never needs to leave this app.

## Local development

```bash
npm install
cp .env.example .env.local   # set BACKEND_URL to your local backend, e.g. http://localhost:4000
npm run dev
```

Requires the backend (`../backend`) to be running and reachable at `BACKEND_URL`.

## Deploy (Vercel)

1. Push this folder to its own GitHub repo (e.g. `kopdes-frontend`) — separate from
   `../backend`'s repo.
2. In Vercel: **New Project** → import that repo. Framework preset (Next.js) is
   auto-detected, no build command changes needed.
3. Add one environment variable:
   - `BACKEND_URL` — the deployed backend's URL (e.g. `https://kopdes-backend.vercel.app`),
     no trailing slash.
4. Deploy. Once live, log in with one of the seeded users (see `../backend/README.md`)
   and you'll be forced to change the default password on first login.

Deploy the backend first (or at least know its URL) since `BACKEND_URL` is required
at runtime for every Server Component/Action — there's nothing to fall back to locally.
