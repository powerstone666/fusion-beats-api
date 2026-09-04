# Fusion Beats API

Music API + web player in a single Next.js project (npm, TypeScript, App Router).
Search songs, albums, artists and playlists, stream previews and download links —
same endpoints and `{ success, data }` shapes as the original Hono service, now as
App Router route handlers, with a Material Design 3 web UI.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API under `/api/*` — see the
in-app [Playground](/playground) explorer for all 14 endpoints.

## Deploy

```bash
npm run build
npm run start
```

Vercel-ready as-is (`vercel --prod` or the dashboard import): no env vars required,
no adapter config. Public CORS (`*`) and `s-maxage=300` caching are configured for
`/api/*`.

## Notes on parity

- Upstream business logic in `lib/` is ported verbatim from the original service.
- `GET /api/artists` and `/api/albums` return `400` when neither `id` nor `link`
  is given (the original only did this for songs/playlists).
- `GET /api/songs/:id/suggestions` prefers provider radio, but radio is
  geo-restricted upstream, so it falls back to more songs by the same artist
  (then title search) instead of erroring.
- Invalid `sortBy`/`sortOrder` values fall back to defaults instead of 400.
