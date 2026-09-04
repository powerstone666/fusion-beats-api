'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import SongCard from '@/components/song-card';
import { audioUrl, img, type Song } from '@/lib/ui-types';

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [songs, setSongs] = useState<Song[]>([]);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!j.success) throw new Error(j.message);
        setSongs(j.data);
      })
      .catch((e) => setError(e.message));
    fetch(`/api/songs/${id}/suggestions?limit=8`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setSuggestions(j.data);
      })
      .catch(() => {});
  }, [id]);

  const song = songs[0];

  return (
    <div>
      {error && <p className="md-body" style={{ color: 'var(--md-error)' }}>{error}</p>}
      {!song && !error && <p className="md-loading md-body">Loading…</p>}
      {song && (
        <div className="flex flex-col gap-4 sm:flex-row">
          {img(song) ? (
            <Image src={img(song)} alt={song.name} width={300} height={300} className="rounded-2xl" />
          ) : null}
          <div>
            <h1 className="md-display" style={{ fontSize: '2rem', lineHeight: '2.5rem' }}>{song.name}</h1>
            <p className="md-body mt-1" style={{ color: 'var(--md-on-surface-variant)' }}>
              {song.artists?.primary?.map((a) => a.name).join(', ')}
              {song.album?.name ? ` • ${song.album.name}` : ''}
            </p>
            {audioUrl(song) ? (
              <audio controls src={audioUrl(song)} className="mt-4 w-full max-w-md" />
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(song.downloadUrl ?? []).map((d) => (
                <a
                  key={d.quality}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="md-chip"
                >
                  {d.quality}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      {suggestions.length > 0 && (
        <section className="mt-8">
          <h2 className="md-headline mb-2">You may also like</h2>
          <div className="grid gap-2">
            {suggestions.map((s) => (
              <SongCard key={s.id} song={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
