'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ initial = '', compact = false }: { initial?: string; compact?: boolean }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className={`md-searchbar${compact ? ' compact' : ''}`}
      role="search"
    >
      <span aria-hidden="true" style={{ color: 'var(--md-on-surface-variant)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={compact ? 'Search music…' : 'Search songs, albums, artists, playlists…'}
        aria-label="Search music"
      />
      <button type="submit" className="md-search-btn">
        Search
      </button>
    </form>
  );
}
