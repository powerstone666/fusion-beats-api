# Fusion Beats API

Music API + web player in a single Next.js project. Search songs, albums,
artists and playlists, stream previews, resolve download links, and explore
everything from an interactive in-app Playground.

## Features

### API — 14 endpoints, one envelope

Every endpoint answers `{ success: true, data }` (errors: `{ success: false,
message }` with a matching HTTP status). All responses are public and
cacheable (`s-maxage=300`), with open CORS so browsers, agents and LLM tools
can call them directly.

| Endpoint | What it does |
|---|---|
| `GET /api/search?query=` | Global search across songs, albums, artists, playlists |
| `GET /api/search/songs?query=&page=&limit=` | Paginated song search |
| `GET /api/search/albums?query=&page=&limit=` | Paginated album search |
| `GET /api/search/artists?query=&page=&limit=` | Paginated artist search |
| `GET /api/search/playlists?query=&page=&limit=` | Paginated playlist search |
| `GET /api/songs?ids=a,b&link=` | Songs by comma-separated IDs or a direct song link |
| `GET /api/songs/:id` | Full song details incl. 5 download qualities + artwork |
| `GET /api/songs/:id/suggestions?limit=` | Similar songs for infinite playback |
| `GET /api/albums?id=&link=` | Album with track list |
| `GET /api/artists?id=&link=&page=&songCount=&albumCount=&sortBy=&sortOrder=` | Artist profile with top songs/albums |
| `GET /api/artists/:id` | Same, addressed by path |
| `GET /api/artists/:id/songs?page=&sortBy=&sortOrder=` | Paginated, sortable song list |
| `GET /api/artists/:id/albums?page=&sortBy=&sortOrder=` | Paginated, sortable album list |
| `GET /api/playlists?id=&link=&page=&limit=` | Playlist with songs |

Song payloads carry multi-quality `downloadUrl` (12–320kbps) and `image`
(50/150/500px) arrays; every `id`/`link` lookup accepts either form, and
`link` tokens are extracted server-side from pasted URLs.

### Smart suggestions with graceful fallback

`GET /api/songs/:id/suggestions` tries provider radio first. Because radio is
geo-restricted upstream (it answers `No new song found` from most regions),
the endpoint falls back to more songs by the same artist, then to a title
search — so it returns playable suggestions instead of erroring, and only
404s when nothing related exists.

### Web UI (Material Design 3)

- **Home** — hero search plus every endpoint as a deep-link into the Playground
- **Search** — All/Songs/Albums/Artists/Playlists filter chips, inline audio previews
- **Detail pages** — `/song|album|artist|playlist/[id]` with artwork, metadata and players
- **Playground** (`/playground`) — interactive console for all 14 endpoints:
  typed parameter forms with pre-filled examples, live URL preview, one-click
  Send, syntax-highlighted JSON, copy-as-cURL, and per-endpoint example
  response structures. Deep-linkable (`/playground?endpoint=song-by-id`;
  legacy `/docs` redirects here).
- Floating pill navbar, light + dark schemes following the OS preference.

### MCP server for AI clients

`POST /api/mcp` is a Streamable-HTTP MCP server (`fusion-beats-api`) so any
MCP-capable AI can call the catalog directly — no REST wrangling needed:

- `search_songs(query, page, limit)` / `search_all(query)` — find music
- `get_song(ids?, link?)` — full details incl. all stream qualities
- `get_stream_url(id, quality?)` — best direct audio URL + alternatives;
  feed `.data.url` to any player to stream
- `get_suggestions(id, limit?)` — similar songs
- resource `fusion-beats://docs` — tool + REST reference

Point your client at `https://<host>/api/mcp` (Streamable HTTP).

### Hardened by default

- Missing `query`/`id`/`link` → `400` with a plain message (albums/artists
  included, stricter than the original service)
- Invalid `sortBy`/`sortOrder` fall back to defaults instead of 400
- Upstream calls time out after 15s; upstream error strings never leak as 500s

## Structure

```
fusion-beats-api/
├── app/
│   ├── api/                    # 14 route handlers (backend)
│   │   ├── search/route.ts
│   │   ├── search/songs|albums|artists|playlists/route.ts
│   │   ├── songs/route.ts  songs/[id]/route.ts  songs/[id]/suggestions/route.ts
│   │   ├── albums/route.ts
│   │   ├── artists/route.ts  artists/[id]/route.ts
│   │   │       artists/[id]/songs|albums/route.ts
│   │   └── playlists/route.ts
│   ├── song|album|artist|playlist/[id]/  # detail pages (frontend)
│   ├── search/                 # tabbed search UI (client)
│   ├── playground/             # interactive API console (client)
│   ├── docs/                   # redirect → /playground (keeps old links alive)
│   ├── layout.tsx              # metadata + navbar shell
│   ├── page.tsx                # home: hero search + linked endpoint index
│   ├── md3.css                 # Material You tokens + components
│   └── globals.css             # Tailwind base
├── components/
│   ├── api-explorer.tsx        # request builder + live response viewer
│   ├── search-bar.tsx          # MD3 search bar
│   ├── song-card.tsx           # artwork + metadata + audio preview
│   ├── cards.tsx               # album/artist/playlist grid cards
│   └── navbar.tsx              # floating pill top bar
├── lib/
│   ├── api-helpers.ts          # ok/fail envelopes, param parsing, link-token extractors
│   ├── api-catalog.ts          # endpoint/param metadata driving the Playground
│   ├── api-examples.ts         # example response per endpoint
│   ├── ui-types.ts             # frontend view-model types + image/audio pickers
│   ├── common/                 # endpoints table, fetch helper, link decryptor, shared types
│   └── modules/<m>/           # per-domain services → use-cases → payload builders
│       ├── services/           # thin facades over use-cases
│       ├── use-cases/          # one class per operation (upstream call + mapping)
│       ├── helpers/            # response → public payload transformers
│       └── models/             # zod schemas for upstream + public shapes
└── next.config.ts              # saavncdn images, CORS headers for /api/*
```

## Request flow

`route.ts` (validate params → 400 on missing) → `*Service` → `*UseCase.execute`
→ `saavnFetch` (`https://www.jiosaavn.com/api.php` + random user-agent, 15s
timeout) → `create*Payload` helper (decrypts `encrypted_media_url` via DES
into 5 download qualities, expands artwork into 3 sizes) → `{ success, data }`.

The Playground reuses the same path: its parameter catalog (`api-catalog.ts`)
mirrors route validation, and `Fill examples` uses the same example values the
docs advertise — so anything that works in the console works over HTTP.
