// Single source of truth for the interactive API explorer (/docs).
// Mirrors the validation/defaults in app/api/*/route.ts + lib/api-helpers.ts.
export interface ApiParam {
  name: string;
  in: 'path' | 'query';
  type: 'string' | 'number' | 'enum';
  required: boolean;
  default?: string;
  description: string;
  options?: string[];
  example?: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET';
  path: string; // {name} = path placeholder
  tag: string;
  summary: string;
  description: string;
  params: ApiParam[];
}

const pageLimit: ApiParam[] = [
  {
    name: 'page',
    in: 'query',
    type: 'number',
    required: false,
    default: '0',
    description: 'Page number of results',
    example: '0'
  },
  {
    name: 'limit',
    in: 'query',
    type: 'number',
    required: false,
    default: '10',
    description: 'Results per page',
    example: '10'
  }
];

const sortParams: ApiParam[] = [
  {
    name: 'sortBy',
    in: 'query',
    type: 'enum',
    required: false,
    default: 'popularity',
    description: 'Field to sort by',
    options: ['popularity', 'latest', 'alphabetical'],
    example: 'popularity'
  },
  {
    name: 'sortOrder',
    in: 'query',
    type: 'enum',
    required: false,
    description: 'Sort direction (default differs per endpoint)',
    options: ['asc', 'desc'],
    example: 'desc'
  }
];

const searchExtra: ApiParam[] = [
  {
    name: 'query',
    in: 'query',
    type: 'string',
    required: true,
    description: 'Search text',
    example: 'Imagine Dragons'
  },
  ...pageLimit
];

export const API_CATALOG: ApiEndpoint[] = [
  {
    id: 'global-search',
    method: 'GET',
    path: '/api/search',
    tag: 'Search',
    summary: 'Global search',
    description: 'Songs, albums, artists and playlists matching the query.',
    params: [{ name: 'query', in: 'query', type: 'string', required: true, description: 'Search text', example: 'Imagine Dragons' }]
  },
  {
    id: 'search-songs',
    method: 'GET',
    path: '/api/search/songs',
    tag: 'Search',
    summary: 'Search songs',
    description: 'Paginated song search.',
    params: [{ ...searchExtra[0], example: 'Believer' }, ...pageLimit]
  },
  {
    id: 'search-albums',
    method: 'GET',
    path: '/api/search/albums',
    tag: 'Search',
    summary: 'Search albums',
    description: 'Paginated album search.',
    params: [{ ...searchExtra[0], example: 'Evolve' }, ...pageLimit]
  },
  {
    id: 'search-artists',
    method: 'GET',
    path: '/api/search/artists',
    tag: 'Search',
    summary: 'Search artists',
    description: 'Paginated artist search.',
    params: [{ ...searchExtra[0], example: 'Adele' }, ...pageLimit]
  },
  {
    id: 'search-playlists',
    method: 'GET',
    path: '/api/search/playlists',
    tag: 'Search',
    summary: 'Search playlists',
    description: 'Paginated playlist search.',
    params: [{ ...searchExtra[0], example: 'Indie' }, ...pageLimit]
  },
  {
    id: 'songs-by-ids-or-link',
    method: 'GET',
    path: '/api/songs',
    tag: 'Songs',
    summary: 'Songs by IDs or link',
    description: 'One of ids / link is required.',
    params: [
      {
        name: 'ids',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Comma-separated song IDs',
        example: '1ZDlyUiL,JdJ_osp0'
      },
      {
        name: 'link',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Direct song link (token is extracted from it)',
        example: 'https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM'
      }
    ]
  },
  {
    id: 'song-by-id',
    method: 'GET',
    path: '/api/songs/{id}',
    tag: 'Songs',
    summary: 'Song by ID',
    description: 'Full song details incl. download URLs.',
    params: [{ name: 'id', in: 'path', type: 'string', required: true, description: 'Song ID', example: '1ZDlyUiL' }]
  },
  {
    id: 'song-suggestions',
    method: 'GET',
    path: '/api/songs/{id}/suggestions',
    tag: 'Songs',
    summary: 'Song suggestions',
    description: 'Similar songs for infinite playback.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, description: 'Seed song ID', example: '1ZDlyUiL' },
      { name: 'limit', in: 'query', type: 'number', required: false, default: '10', description: 'Max suggestions', example: '5' }
    ]
  },
  {
    id: 'album',
    method: 'GET',
    path: '/api/albums',
    tag: 'Albums',
    summary: 'Album by ID or link',
    description: 'One of id / link is required.',
    params: [
      { name: 'id', in: 'query', type: 'string', required: false, description: 'Album ID', example: '23241654' },
      {
        name: 'link',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Direct album link',
        example: 'https://www.jiosaavn.com/album/future-nostalgia/ITIyo-GDr7A_'
      }
    ]
  },
  {
    id: 'artist',
    method: 'GET',
    path: '/api/artists',
    tag: 'Artists',
    summary: 'Artist by ID or link',
    description: 'One of id / link is required.',
    params: [
      { name: 'id', in: 'query', type: 'string', required: false, description: 'Artist ID', example: '1274170' },
      {
        name: 'link',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Direct artist link',
        example: 'https://www.jiosaavn.com/artist/dua-lipa-songs/r-OWIKgpX2I_'
      },
      { ...pageLimit[0], example: '0' },
      { name: 'songCount', in: 'query', type: 'number', required: false, default: '10', description: 'Top songs to include', example: '10' },
      { name: 'albumCount', in: 'query', type: 'number', required: false, default: '10', description: 'Top albums to include', example: '10' },
      ...sortParams
    ]
  },
  {
    id: 'artist-by-id',
    method: 'GET',
    path: '/api/artists/{id}',
    tag: 'Artists',
    summary: 'Artist by ID',
    description: 'Artist details with top songs/albums.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, description: 'Artist ID', example: '1274170' },
      { ...pageLimit[0], example: '0' },
      { name: 'songCount', in: 'query', type: 'number', required: false, default: '10', description: 'Top songs to include', example: '10' },
      { name: 'albumCount', in: 'query', type: 'number', required: false, default: '10', description: 'Top albums to include', example: '10' },
      ...sortParams
    ]
  },
  {
    id: 'artist-songs',
    method: 'GET',
    path: '/api/artists/{id}/songs',
    tag: 'Artists',
    summary: "Artist's songs",
    description: 'Paginated, sortable song list.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, description: 'Artist ID', example: '1274170' },
      { ...pageLimit[0], example: '0' },
      ...sortParams
    ]
  },
  {
    id: 'artist-albums',
    method: 'GET',
    path: '/api/artists/{id}/albums',
    tag: 'Artists',
    summary: "Artist's albums",
    description: 'Paginated, sortable album list.',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, description: 'Artist ID', example: '1274170' },
      { ...pageLimit[0], example: '0' },
      ...sortParams
    ]
  },
  {
    id: 'playlist',
    method: 'GET',
    path: '/api/playlists',
    tag: 'Playlists',
    summary: 'Playlist by ID or link',
    description: 'One of id / link is required.',
    params: [
      { name: 'id', in: 'query', type: 'string', required: false, description: 'Playlist ID', example: '82914609' },
      {
        name: 'link',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Direct playlist link',
        example: 'https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_'
      },
      ...pageLimit
    ]
  }
];

export const API_TAGS = [...new Set(API_CATALOG.map((e) => e.tag))];
