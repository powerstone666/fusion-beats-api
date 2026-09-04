// Loose view-model types for the frontend. The API payloads are built by
// lib/modules/*/helpers and returned as { success, data }.
export interface ImageLink {
  quality: string;
  url: string;
}

export interface DownloadLink {
  quality: string;
  url: string;
}

export interface ArtistRef {
  id?: string;
  name?: string;
  type?: string;
  image?: ImageLink[];
  url?: string;
}

export interface Song {
  id: string;
  name: string;
  type?: string;
  year?: string | null;
  duration?: number | null;
  language?: string;
  url?: string;
  album?: { id?: string | null; name?: string | null; url?: string | null };
  artists?: { primary?: ArtistRef[]; featured?: ArtistRef[]; all?: ArtistRef[] };
  image?: ImageLink[];
  downloadUrl?: DownloadLink[];
}

export interface Album {
  id: string;
  name: string;
  year?: number | null;
  url?: string;
  image?: ImageLink[];
  artists?: { primary?: ArtistRef[]; featured?: ArtistRef[]; all?: ArtistRef[] };
  songs?: Song[];
}

export interface Artist {
  id: string;
  name: string;
  url?: string;
  image?: ImageLink[];
  topSongs?: Song[];
  topAlbums?: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  url?: string;
  image?: ImageLink[];
  songCount?: number | null;
  songs?: Song[];
}

export function img(item: { image?: ImageLink[] }, pref = '500x500'): string {
  return item.image?.find((i) => i.quality === pref)?.url ?? item.image?.[0]?.url ?? '';
}

export function audioUrl(song: Song): string {
  const urls = song.downloadUrl ?? [];
  return (
    urls.find((d) => d.quality === '320kbps')?.url ??
    urls[urls.length - 1]?.url ??
    ''
  );
}
