'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { GridCard } from '@/components/cards';
import SongCard from '@/components/song-card';
import type { Album, Artist, Playlist, Song } from '@/lib/ui-types';

type Tab = 'all' | 'songs' | 'albums' | 'artists' | 'playlists';

const tabs: { id: Tab; label: string; path: string }[] = [
  { id: 'all', label: 'All', path: '/api/search' },
  { id: 'songs', label: 'Songs', path: '/api/search/songs' },
  { id: 'albums', label: 'Albums', path: '/api/search/albums' },
  { id: 'artists', label: 'Artists', path: '/api/search/artists' },
  { id: 'playlists', label: 'Playlists', path: '/api/search/playlists' }
];

function useSearchResults(q: string, tab: Tab) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [snapshot, setSnapshot] = useState<{ key: string; data?: any; error?: string } | null>(null);

  useEffect(() => {
    if (!q) return;
    const t = tabs.find((x) => x.id === tab)!;
    const key = `${t.id}:${q}`;
    let cancelled = false;
    fetch(`${t.path}?query=${encodeURIComponent(q)}&limit=12`).then(
      async (r) => {
        const j = await r.json();
        if (cancelled) return;
        if (!j.success) setSnapshot({ key, error: j.message || 'Search failed' });
        else setSnapshot({ key, data: j.data });
      },
      (e) => {
        if (!cancelled) setSnapshot({ key, error: e.message });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [q, tab]);

  const current = snapshot && snapshot.key === `${tab}:${q}` ? snapshot : null;
  return { data: current?.data ?? null, error: current?.error ?? '', loading: q !== '' && !current };
}

function SearchView() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [tab, setTab] = useState<Tab>('all');
  const { data, error, loading } = useSearchResults(q, tab);

  if (!q) return <p className="md-body" style={{ color: 'var(--md-on-surface-variant)' }}>Type a query above to search.</p>;

  return (
    <div>
      <h1 className="md-headline mb-3">
        Results for <span style={{ color: 'var(--md-primary)' }}>{q}</span>
      </h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`md-chip${tab === t.id ? ' selected' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading && <p className="md-loading md-body">Loading…</p>}
      {error && <p className="md-body" style={{ color: 'var(--md-error)' }}>{error}</p>}
      {data && tab === 'all' && <AllResults data={data} />}
      {data && tab === 'songs' && <SongList songs={data.results} />}
      {data && tab === 'albums' && <AlbumGrid albums={data.results} />}
      {data && tab === 'artists' && <ArtistGrid artists={data.results} />}
      {data && tab === 'playlists' && <PlaylistGrid playlists={data.results} />}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AllResults({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="md-title mb-2">Songs</h2>
        <SongList songs={data.songs?.results?.slice(0, 5) ?? []} />
      </section>
      <section>
        <h2 className="md-title mb-2">Albums</h2>
        <AlbumGrid albums={data.albums?.results?.slice(0, 4) ?? []} />
      </section>
      <section>
        <h2 className="md-title mb-2">Artists</h2>
        <ArtistGrid artists={data.artists?.results?.slice(0, 4) ?? []} />
      </section>
      <section>
        <h2 className="md-title mb-2">Playlists</h2>
        <PlaylistGrid playlists={data.playlists?.results?.slice(0, 4) ?? []} />
      </section>
    </div>
  );
}

function SongList({ songs }: { songs: Song[] }) {
  if (!songs.length) return <p className="md-caption">No songs.</p>;
  return (
    <div className="grid gap-2">
      {songs.map((s) => (
        <SongCard key={s.id} song={s} />
      ))}
    </div>
  );
}

function AlbumGrid({ albums }: { albums: Album[] }) {
  if (!albums.length) return <p className="md-caption">No albums.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {albums.map((a) => (
        <GridCard key={a.id} href={`/album/${a.id}`} title={a.name} subtitle={String(a.year ?? '')} image={a} />
      ))}
    </div>
  );
}

function ArtistGrid({ artists }: { artists: Artist[] }) {
  if (!artists.length) return <p className="md-caption">No artists.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {artists.map((a) => (
        <GridCard key={a.id} href={`/artist/${a.id}`} title={a.name} image={a} />
      ))}
    </div>
  );
}

function PlaylistGrid({ playlists }: { playlists: Playlist[] }) {
  if (!playlists.length) return <p className="md-caption">No playlists.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {playlists.map((p) => (
        <GridCard
          key={p.id}
          href={`/playlist/${p.id}`}
          title={p.name}
          subtitle={p.songCount ? `${p.songCount} songs` : undefined}
          image={p}
        />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="md-loading md-body">Loading…</p>}>
      <SearchView />
    </Suspense>
  );
}
