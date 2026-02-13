# The Divine Paradox (codex-engine)

Live: `https://thedivineparadox.com`

This repo is a small experimental product:
- a stateful, long-term interaction system
- static frontend + serverless backend
- local-first progression (achievements/treasury) with an authenticated expansion path

## What It Is
- Generate one short "ability + consequence" sentence per interaction.
- Track interaction state across time (combo, attitude, daily streak).
- Let users archive observations in a treasury and unlock milestones.

## Architecture (Practical)
- Frontend: static `index.html` + `main.js` + `style.css`
  - localStorage-backed systems: achievements, treasury, daily streak, preferences
- Backend: Netlify Functions
  - `/.netlify/functions/generate` (calls OpenAI via env key)
  - `/.netlify/functions/progress` (Firebase ID token verified; DB wiring scaffold)

## Local Development
1. Install deps:

```bash
npm install
```

2. Start Netlify dev (recommended if you want functions locally):

```bash
npm install -g netlify-cli
netlify dev
```

3. Or open the static page:
- open `index.html` directly (generation requires the function endpoint)

## Required Runtime Env
### Generate function (OpenAI)
- `OPENAI_API_KEY` (or `OPENAI_API_TOKEN`)
- optional `OPENAI_MODEL` (default: `gpt-5-nano`)

### Progress function (Firebase Auth)
- `FIREBASE_PROJECT_ID` (or `GCP_PROJECT_ID`)
- request header: `Authorization: Bearer <firebase_id_token>`

## Repo Safety Notes
- Do not commit `.env` files or any credentials.
- Keep secrets in Netlify environment variables only.

## Docs
- Public release notes: `docs/PUBLIC_RELEASE_GUIDE.md`
- Inheritance note: `docs/ABILITY_INHERITANCE.md`
