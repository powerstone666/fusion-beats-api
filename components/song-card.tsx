'use client';

import Image from 'next/image';
import Link from 'next/link';
import { audioUrl, img, type Song } from '@/lib/ui-types';

function fmt(sec?: number | null) {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function SongCard({ song }: { song: Song }) {
  const src = audioUrl(song);
  return (
    <div className="md-card md-card-filled flex items-center gap-3 p-3">
      {img(song) ? (
        <Image
          src={img(song, '150x150')}
          alt={song.name}
          width={56}
          height={56}
          className="rounded-xl"
          style={{ borderRadius: 12 }}
        />
      ) : (
        <div className="h-14 w-14 shrink-0" style={{ borderRadius: 12, background: 'var(--md-surface-container-high)' }} />
      )}
      <div className="min-w-0 flex-1">
        <Link href={`/song/${song.id}`} className="md-label block truncate hover:underline">
          {song.name}
        </Link>
        <p className="md-caption truncate">
          {song.artists?.primary?.map((a) => a.name).join(', ') || song.language || ''}
          {fmt(song.duration) ? ` • ${fmt(song.duration)}` : ''}
        </p>
        {src ? <audio controls preload="none" src={src} className="mt-1 h-8 w-full max-w-xs" /> : null}
      </div>
    </div>
  );
}
