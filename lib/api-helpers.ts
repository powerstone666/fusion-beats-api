import { NextResponse } from 'next/server';
import { HTTPException } from 'hono/http-exception';

export function ok(data: unknown) {
  // Public, cacheable data — mirrors the original `s-maxage=300` behaviour.
  return NextResponse.json(
    { success: true, data },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}

export function fail(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

export function handleError(e: unknown) {
  if (e instanceof HTTPException) {
    return fail(e.message, e.status || 500);
  }
  return fail(e instanceof Error ? e.message : 'Internal server error', 500);
}

export function numParam(searchParams: URLSearchParams, key: string, def: number): number {
  const raw = searchParams.get(key);
  if (raw === null || raw === '') return def;
  const n = Number(raw);
  return Number.isNaN(n) ? def : n;
}

export function extractSongToken(link: string | null): string | undefined {
  return link?.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1];
}

export function extractAlbumToken(link: string | null): string | undefined {
  return link?.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1];
}

export function extractArtistToken(link: string | null): string | undefined {
  return link?.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1];
}

export function extractPlaylistToken(link: string | null): string | undefined {
  const matches = link?.match(
    /(?:jiosaavn\.com|saavn\.com)\/(?:featured|s\/playlist)\/[^/]+\/([^/]+)$|\/([^/]+)$/
  );
  const filtered = matches?.filter((each) => each !== undefined);
  return (filtered && filtered[filtered.length - 1]) || undefined;
}

export type SortBy = 'popularity' | 'latest' | 'alphabetical';
export type SortOrder = 'asc' | 'desc';

const SORT_BY: SortBy[] = ['popularity', 'latest', 'alphabetical'];
const SORT_ORDER: SortOrder[] = ['asc', 'desc'];

export function sortByParam(searchParams: URLSearchParams, def: SortBy): SortBy {
  const v = searchParams.get('sortBy');
  return v !== null && (SORT_BY as string[]).includes(v) ? (v as SortBy) : def;
}

export function sortOrderParam(searchParams: URLSearchParams, def: SortOrder): SortOrder {
  const v = searchParams.get('sortOrder');
  return v !== null && (SORT_ORDER as string[]).includes(v) ? (v as SortOrder) : def;
}
