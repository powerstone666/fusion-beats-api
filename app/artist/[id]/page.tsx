'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { GridCard } from '@/components/cards';
import SongCard from '@/components/song-card';
import { img, type Artist } from '@/lib/ui-types';

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/artists/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!j.success) throw new Error(j.message);
        setArtist(j.data);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="md-body" style={{ color: 'var(--md-error)' }}>{error}</p>;
  if (!artist) return <p className="md-loading md-body">Loading…</p>;

  return (
    <div>
      <div className="flex items-center gap-4">
        {img(artist) ? (
          <Image src={img(artist)} alt={artist.name} width={160} height={160} className="rounded-full" />
        ) : null}
        <h1 className="md-display" style={{ fontSize: '2rem', lineHeight: '2.5rem' }}>{artist.name}</h1>
      </div>
      {(artist.topSongs?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="md-headline mb-2">Top songs</h2>
          <div className="grid gap-2">
            {artist.topSongs!.map((s) => (
              <SongCard key={s.id} song={s} />
            ))}
          </div>
        </section>
      )}
      {(artist.topAlbums?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="md-headline mb-2">Top albums</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {artist.topAlbums!.map((a) => (
              <GridCard key={a.id} href={`/album/${a.id}`} title={a.name} image={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
