'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import SongCard from '@/components/song-card';
import { img, type Playlist } from '@/lib/ui-types';

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/playlists?id=${id}&limit=20`)
      .then(async (r) => {
        const j = await r.json();
        if (!j.success) throw new Error(j.message);
        setPlaylist(j.data);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="md-body" style={{ color: 'var(--md-error)' }}>{error}</p>;
  if (!playlist) return <p className="md-loading md-body">Loading…</p>;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {img(playlist) ? (
          <Image src={img(playlist)} alt={playlist.name} width={300} height={300} className="rounded-2xl" />
        ) : null}
        <div>
          <h1 className="md-display" style={{ fontSize: '2rem', lineHeight: '2.5rem' }}>{playlist.name}</h1>
          {playlist.songCount ? <p className="md-body mt-1" style={{ color: 'var(--md-on-surface-variant)' }}>{playlist.songCount} songs</p> : null}
        </div>
      </div>
      <section className="mt-6">
        <h2 className="md-headline mb-2">Songs</h2>
        <div className="grid gap-2">
          {(playlist.songs ?? []).map((s) => (
            <SongCard key={s.id} song={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
