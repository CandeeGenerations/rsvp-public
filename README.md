# rsvp-public

Public-facing RSVP page. Mobile-first SPA hosted on Netlify; per-recipient links of the form
`https://rsvp.cgen.io/r/<token>` resolve to a Yes/No/Maybe form that writes back to Central Flock
via the `cgen-api` proxy.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (mirrors Central Flock's design tokens — radix-luma neutral palette)
- No router; the token is read from `window.location.pathname`

## Env

- `VITE_CGEN_API_BASE` — base URL for the cgen-api server (e.g. `https://api.cgen.io`)

## Develop

```sh
pnpm install
pnpm dev
```

## Deploy

Netlify — see `netlify.toml`. The `/r/*` redirect routes the path-based token to the SPA.
