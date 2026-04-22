# Northstar — Academic Advising Studio

A boutique academic advising and admissions strategy workspace. Intake, dossier review, essay coaching, school fit, interview preparation — bilingual English and Tiếng Việt.

Built as a static web app that can be deployed to GitHub Pages **today**, with an AI architecture already wired in and ready to be upgraded to real model calls later without touching product code.

## Why this exists

Most applications fail not because the student is weak, but because:

- the dossier is disorganized,
- the essays are generic,
- and the school list is miscalibrated.

Northstar is built to catch all three, as a calm editorial workspace rather than a chat window.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run typecheck
npm run build    # static build in ./dist
npm run preview  # serve the built site
```

Requires Node 20+.

## Architecture at a glance

| Layer | Where | Notes |
|---|---|---|
| UI | `src/pages/`, `src/components/` | React 19, Tailwind v4, Recharts, Motion |
| Routing | `src/App.tsx` | `HashRouter` for GitHub Pages deep-link safety |
| i18n | `src/dictionaries/{en,vi}.ts`, `src/lib/i18n.ts`, `src/context/LanguageContext.tsx` | Curated bilingual dictionaries |
| Browser persistence | `src/lib/storage/{localStorage,indexedDB}.ts` + hooks | All user data stays in the browser |
| AI abstraction | `src/lib/ai/` | `AIProvider` interface + mock engines + prompts |
| Readiness engine | `src/lib/readiness.ts` | Pure function: intake + drafts + shortlist → dashboard snapshot |

### Pages
- `/` — Home
- `/intake` — 9-step intake flow
- `/dashboard` — Readiness overview with Recharts
- `/dossier` — Structured dossier review
- `/essay-lab` — Writing studio with per-draft review
- `/school-fit` — Shortlist with reasoning and compare mode
- `/interview-prep` — Question bank with rubric feedback and practice history

## Local-first persistence

Northstar v1 does not use a database. Everything lives in the browser:

- **localStorage** — language preference and other light settings
- **IndexedDB** (stores: `intake`, `transcripts`, `cv`, `activities`, `essays`, `dossierAnalyses`, `schoolShortlist`, `schoolReasoning`, `interviewAnswers`, `dashboardSnapshots`, `stories`)

Benefits:
- Zero infrastructure — perfect fit for GitHub Pages.
- No PII ever leaves the user's device until you decide otherwise.

Trade-offs:
- No cross-device sync.
- Clearing site data resets the workspace.

## Mock AI mode (the default)

When there is no server adapter and no API key, the app runs in **mock mode**.

- UI shows a "Local analysis mode" badge.
- `src/lib/ai/provider.ts` returns a `MockProvider`.
- Each surface (dossier, essay, school fit, interview, profile summary) has a dedicated rule-based engine in `src/lib/ai/mock/`.
- Engines inspect real input — word count, sentence structure, numeric evidence density, reflective vocabulary, generic phrase detection, GPA bands, activity sustainability — and produce structured feedback that varies with what the user wrote.
- Outputs are rendered identically to what the server AI would produce, in the active UI language (EN/VI).

Mock mode is not a stub. It is a usable offline layer that keeps the product meaningful before any key is introduced.

## Upgrading to real AI later

The app is designed so that turning on real AI is an additive change.

1. Move the project to a server-capable host (Vercel / Cloudflare Workers / Fly / a Node process behind a CDN). GitHub Pages alone cannot run server code.
2. Create a route handler (e.g., `/api/ai`) that:
   - Accepts `{ action, payload }`.
   - Reads the API key from a **server-side** environment variable (never shipped to the browser).
   - Calls your preferred model provider (Gemini, Anthropic, OpenAI, etc.) using the prompts in `src/lib/ai/prompts/`.
   - Returns JSON conforming to the types in `src/lib/ai/types.ts`.
3. Add a `ServerProvider` class to `src/lib/ai/provider.ts` that `fetch`es this endpoint. A scaffold comment is already there.
4. Set `VITE_AI_PROVIDER=server` and `VITE_AI_ENDPOINT=/api/ai` at build time.
5. Rebuild. The UI instantly switches its badge from "Local analysis mode" to "Server AI mode" and all pages start calling the server.

You do **not** need to change any page component, any mock engine, or any schema. The `AIProvider` abstraction is the only seam.

### Why API keys must not live in the browser
Any key shipped to the client can be read by anyone who opens dev tools. The architecture deliberately routes all real calls through a server. See `CLAUDE.md` for the short version.

## Bilingual UI

- Dictionaries are hand-curated, not auto-translated. See `src/dictionaries/en.ts` and `src/dictionaries/vi.ts`.
- Mock AI output supports both languages — every engine branches on `locale`.
- To add a phrase, add it to `en.ts` **and** `vi.ts` and reference via `useLocale().t.section.key`.

## Deployment

### GitHub Pages (current target)

- `.github/workflows/ci.yml` — typecheck + build on every push and PR.
- `.github/workflows/deploy-pages.yml` — on push to `main`, build with the correct `BASE_PATH` (derived from the repo name), upload the artifact, and deploy.
- The build copies `index.html` to `404.html` and drops a `.nojekyll` file so deep-linked hash routes resolve correctly.

To enable Pages:
1. Push this repo to GitHub.
2. In repo **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow builds and publishes automatically.

The deployed site runs in **mock AI mode**. That is expected and intentional for a static deploy.

### Migrating to a server-capable host

When you want real AI, move to Vercel / Cloudflare Pages / Fly / Netlify / a Node box. Add the route handler described above, set env vars there (not here), and keep `BASE_PATH=/` unless the host puts you under a subpath.

## Environment variables

Copy `.env.example` to `.env.local` for local experiments (optional, not required to run).

| Variable | Purpose | Where it lives |
|---|---|---|
| `VITE_AI_PROVIDER` | `mock` (default) or `server` | Build-time, client |
| `VITE_AI_ENDPOINT` | Path of the server AI route, e.g. `/api/ai` | Build-time, client |
| `AI_API_KEY` | Provider key — **only set on the server host**, never exposed via `VITE_*` | Server-side only |

## Project layout

```
src/
  App.tsx
  main.tsx
  index.css
  components/        # Layout, AIModeBadge, LanguageToggle, ui primitives, charts
  context/           # LanguageContext
  data/              # Seed data (schools, interview questions)
  dictionaries/      # en.ts, vi.ts (curated)
  hooks/             # useLocale, useLocalStorageState, useIndexedDBState
  lib/
    ai/
      provider.ts
      types.ts
      actions/       # Thin wrappers around provider methods
      mock/          # Input-aware rule-based engines
      prompts/       # Prompts the server adapter will use
    storage/
      localStorage.ts
      indexedDB.ts
      schemas.ts
    i18n.ts
    readiness.ts
  pages/             # Home, Intake, Dashboard, DossierReview, EssayLab, SchoolFit, InterviewPrep, NotFound
```

## License

Private — for portfolio / demo use.
