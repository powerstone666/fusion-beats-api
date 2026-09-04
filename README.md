# Fusion Beats API

Music API + web player in a single Next.js project (npm, TypeScript,
App Router). Search songs, albums, artists and playlists, stream previews and
download links — 14 endpoints as App Router route handlers, with a Material
Design 3 web UI and an interactive API Playground.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API under `/api/*` — try it
live in the in-app [Playground](/playground): all 14 endpoints with parameter
forms, pre-filled examples, live responses and copy-as-cURL. Deep-link any
endpoint, e.g. `/playground?endpoint=song-by-id` (`/docs` redirects there).

## Deploy

```bash
npm run build
npm run start
```

Vercel-ready as-is (`vercel --prod` or the dashboard import): no env vars required,
no adapter config. Public CORS (`*`) and `s-maxage=300` caching are configured for
`/api/*`.

## Notes

- Upstream business logic in `lib/` is ported from the original Hono service
  (`saavnFetch` helper, payload builders, use-cases).
- `GET /api/artists` and `/api/albums` return `400` when neither `id` nor `link`
  is given (the original only did this for songs/playlists).
- `GET /api/songs/:id/suggestions` prefers provider radio, but radio is
  geo-restricted upstream, so it falls back to more songs by the same artist
  (then title search) instead of erroring.
- Invalid `sortBy`/`sortOrder` values fall back to defaults instead of 400.
- Upstream calls time out after 15s so a hung provider can't hold a route open.
