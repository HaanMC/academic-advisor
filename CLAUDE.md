# CLAUDE.md

Notes for future Claude sessions working on this repository.

## What this is
A premium academic advising and admissions strategy workspace (Northstar). Intake, dossier review, essay coaching, school fit, and interview preparation — bilingual EN/VI.

## Non-negotiables
- **Design**: editorial, restrained, warm paper palette, serif for headlines, minimal motion. Do not make it look like a generic AI SaaS, crypto dashboard, or neon landing page. No glassmorphism, glowing gradients, floating blobs, cartoony icons, or random decorative shapes.
- **Data**: browser-local only in v1. Use `src/lib/storage/localStorage.ts` for small preferences and `src/lib/storage/indexedDB.ts` for content (transcripts, CVs, essays, analyses, shortlists, interview answers, stories).
- **AI**: never put API keys in the browser. The app runs in mock mode by default through `src/lib/ai/provider.ts`. Real AI is wired by adding a server adapter that implements `AIProvider` — the abstraction is already there.
- **i18n**: bilingual Vietnamese and English. Use `src/dictionaries/en.ts` and `src/dictionaries/vi.ts`. Do not machine-translate static UI strings.
- **Quality bar**: before finishing, run `npm run typecheck` and `npm run build`. Both must pass.

## Architecture
- Vite + React 19 + TypeScript strict + Tailwind v4 + HashRouter (so GitHub Pages deep-links work).
- `src/lib/ai/provider.ts` — single abstraction. Mock mode today; server mode later.
- `src/lib/ai/mock/*` — input-aware rule-based engines that produce realistic structured output.
- `src/lib/ai/prompts/*` — the prompts the server adapter will use once wired.
- `src/lib/storage/schemas.ts` — shared types. Treat them as the contract between persistence and UI.
- `src/lib/readiness.ts` — dashboard computation. Pure function over intake + drafts + shortlist.
- HashRouter is used deliberately for GitHub Pages. Do not switch to BrowserRouter without also adding a server runtime.

## When adding features
- Add UI strings to both `en.ts` and `vi.ts`.
- Persist new content in IndexedDB via `useIndexedDBState` or a new store in `STORES`.
- If you need new AI behavior, add it to the `AIProvider` interface, the mock engine, and the prompt file — in that order.

## Deployment
- GitHub Actions builds and deploys to GitHub Pages on push to `main`. The workflow is in `.github/workflows/deploy-pages.yml`.
- The base path is computed from `$GITHUB_REPOSITORY`. For other hosts, override `BASE_PATH`.
- Because this is a static deploy, only mock AI is active in production today.

## What NOT to do
- Do not add backend runtime assumptions (server actions, Next.js route handlers) into the client code.
- Do not import Node modules into `src/`.
- Do not commit `.env`.
- Do not invent or inline Gemini/OpenAI SDK usage from the browser — it leaks keys.
