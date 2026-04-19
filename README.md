# shortlist-ai

Small Vite + React app: sign in with Supabase, walk through resume → job description → how much time you have, then call an edge function that runs the AI analysis. You get a report page with scores, gaps, and interview-ish prompts.

Nothing fancy — I mostly built this for myself. If you're cloning it, you'll need your own Supabase project and the `analyze-application` function deployed (see `supabase/`).

## run it

```bash
npm install
npm run dev
```

Opens on **http://localhost:5173** (see `vite.config.ts`).

Build: `npm run build`, then `npm run preview` to sanity-check `dist/`.

## env

Copy `.env.example` → `.env` and fill in:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID` (optional, I use it for reference)

Don't commit `.env`.
