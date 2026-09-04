'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import SongCard from '@/components/song-card';
import { img, type Album } from '@/lib/ui-types';

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/albums?id=${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!j.success) throw new Error(j.message);
        setAlbum(j.data);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="md-body" style={{ color: 'var(--md-error)' }}>{error}</p>;
  if (!album) return <p className="md-loading md-body">Loading…</p>;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {img(album) ? (
          <Image src={img(album)} alt={album.name} width={300} height={300} className="rounded-2xl" />
        ) : null}
        <div>
          <h1 className="md-display" style={{ fontSize: '2rem', lineHeight: '2.5rem' }}>{album.name}</h1>
          <p className="md-body mt-1" style={{ color: 'var(--md-on-surface-variant)' }}>
            {album.artists?.primary?.map((a) => a.name).join(', ')}
            {album.year ? ` • ${album.year}` : ''}
          </p>
        </div>
      </div>
      <section className="mt-6">
        <h2 className="md-headline mb-2">Songs</h2>
        <div className="grid gap-2">
          {(album.songs ?? []).map((s) => (
            <SongCard key={s.id} song={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
