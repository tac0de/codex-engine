# Public Release Guide (Developer Community)

## Goal
Share the project publicly for experimental impact while keeping:
- user privacy
- account security
- operational safety

Monetization is limited to optional support/donations.

## Recommended Release Mode
### Public: Yes
- frontend architecture and system design
- local-first game/state logic (achievements/treasury)
- serverless function structure with env-based keys

### Private: Keep out of the public repo
- any `.env` files
- any secret tokens/keys (OpenAI, Firebase Admin, Netlify, GitHub, etc.)
- any user history dumps or personal logs

## What To Sanitize Before Publishing
- Replace real email addresses if you want anonymity.
- Replace real AdSense slot IDs until you are ready to run ads.
- Keep the Gumroad link optional:
  - use a placeholder default
  - allow overrides via `window.__GUMROAD_PRODUCT_URL__`

## Repo Hygiene Checklist
- `.gitignore` blocks `.env` and local artifacts.
- No secrets committed:
  - run secret scan before pushing
- `README.md` includes:
  - how to run locally
  - what env vars are required (names only)
  - how to disable ads/support link safely

## Suggested Documentation Set
- Architecture overview (one page)
- Minimal runbook:
  - deploy steps
  - incident checklist
  - cost guardrails
- Contribution guide:
  - no secrets in PRs
  - required evidence artifacts for changes

## Donation-Only Monetization Setup
- Keep `Support` link visible only when `window.__GUMROAD_PRODUCT_URL__` is set.
- Avoid forcing paywalls while the project is experimental.
