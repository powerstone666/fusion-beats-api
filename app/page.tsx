import Link from 'next/link';
import SearchBar from '@/components/search-bar';

const endpoints: { label: string; id: string }[] = [
  { label: 'GET /api/search?query=', id: 'global-search' },
  { label: 'GET /api/search/songs?query=', id: 'search-songs' },
  { label: 'GET /api/search/albums?query=', id: 'search-albums' },
  { label: 'GET /api/search/artists?query=', id: 'search-artists' },
  { label: 'GET /api/search/playlists?query=', id: 'search-playlists' },
  { label: 'GET /api/songs?ids= or ?link=', id: 'songs-by-ids-or-link' },
  { label: 'GET /api/songs/:id', id: 'song-by-id' },
  { label: 'GET /api/songs/:id/suggestions', id: 'song-suggestions' },
  { label: 'GET /api/albums?id= or ?link=', id: 'album' },
  { label: 'GET /api/artists?id= or ?link=', id: 'artist' },
  { label: 'GET /api/artists/:id', id: 'artist-by-id' },
  { label: 'GET /api/artists/:id/songs', id: 'artist-songs' },
  { label: 'GET /api/artists/:id/albums', id: 'artist-albums' },
  { label: 'GET /api/playlists?id= or ?link=', id: 'playlist' }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="md-hero px-6 py-10 text-center sm:px-12">
        <h1 className="md-display">Fusion Beats API</h1>
        <p className="md-body mx-auto mt-3 max-w-xl" style={{ opacity: 0.85 }}>
          Search songs, albums, artists and playlists, stream previews and build
          your own music experience — API and web player in one Next.js app.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBar />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/search?q=Imagine%20Dragons" className="md-btn md-btn-filled">
            Try: Imagine Dragons
          </Link>
          <Link href="/playground" className="md-btn md-btn-tonal">
            API Docs
          </Link>
        </div>
      </section>

      <section>
        <h2 className="md-headline mb-3">Endpoints</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {endpoints.map((e) => (
            <li key={e.id}>
              <Link
                href={`/playground?endpoint=${e.id}`}
                className="md-code md-card-hover block transition"
                title="Open in API explorer"
              >
                {e.label} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
