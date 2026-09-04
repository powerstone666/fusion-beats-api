// Representative response structures for the Playground (/playground).
// Shapes match what lib/modules/*/helpers produce; values are illustrative.
export const API_EXAMPLES: Record<string, unknown> = {
  'global-search': {
    success: true,
    data: {
      topQuery: {
        results: [
          {
            id: '569172',
            title: 'Imagine Dragons',
            image: [{ quality: '500x500', url: 'https://...' }],
            url: 'https://...',
            type: 'show',
            description: 'Show'
          }
        ],
        position: 0
      },
      songs: {
        results: [
          {
            id: '0W6DtW_N',
            title: 'Believer',
            image: [{ quality: '500x500', url: 'https://...' }],
            album: 'Evolve',
            url: 'https://...',
            type: 'song',
            language: 'english'
          }
        ],
        position: 1
      },
      albums: { results: [], position: 2 },
      artists: { results: [], position: 3 },
      playlists: { results: [], position: 4 }
    }
  },
  'search-songs': {
    success: true,
    data: {
      total: 210,
      start: 0,
      results: [
        {
          id: '0W6DtW_N',
          name: 'Believer',
          type: 'song',
          year: '2020',
          duration: 144,
          language: 'english',
          explicitContent: false,
          playCount: 31097,
          url: 'https://...',
          album: { id: '123', name: 'Evolve', url: 'https://...' },
          artists: { primary: [{ id: '1', name: 'Imagine Dragons' }] },
          image: [{ quality: '500x500', url: 'https://...' }],
          downloadUrl: [{ quality: '320kbps', url: 'https://...' }]
        }
      ]
    }
  },
  'search-albums': {
    success: true,
    data: {
      total: 27,
      start: 0,
      results: [
        {
          id: '59695742',
          name: 'Evolve',
          year: 2017,
          type: 'album',
          language: 'english',
          url: 'https://...',
          playCount: 1000000,
          explicitContent: false,
          artists: { primary: [{ id: '1', name: 'Imagine Dragons' }] },
          image: [{ quality: '500x500', url: 'https://...' }]
        }
      ]
    }
  },
  'search-artists': {
    success: true,
    data: {
      total: 2371,
      start: 0,
      results: [
        {
          id: '610905',
          name: 'Adele',
          role: 'Artist',
          type: 'artist',
          image: [{ quality: '500x500', url: 'https://...' }],
          url: 'https://...'
        }
      ]
    }
  },
  'search-playlists': {
    success: true,
    data: {
      total: 48,
      start: 0,
      results: [
        {
          id: '1219169738',
          name: 'New Indie - Hindi',
          type: 'playlist',
          image: [{ quality: '500x500', url: 'https://...' }],
          url: 'https://...',
          songCount: 40,
          language: 'hindi',
          explicitContent: false
        }
      ]
    }
  },
  'songs-by-ids-or-link': {
    success: true,
    data: [
      {
        id: '1ZDlyUiL',
        name: 'Believer (Imagine Dragons cover)',
        type: 'song',
        year: '2023',
        duration: 202,
        language: 'english',
        hasLyrics: false,
        url: 'https://...',
        album: { id: '41595746', name: 'Believer (Imagine Dragons cover)', url: 'https://...' },
        artists: { primary: [{ id: '15082181', name: 'Polina Cherkas' }] },
        image: [{ quality: '500x500', url: 'https://...' }],
        downloadUrl: [
          { quality: '12kbps', url: 'https://...' },
          { quality: '320kbps', url: 'https://...' }
        ]
      }
    ]
  },
  'song-by-id': {
    success: true,
    data: [
      {
        id: '1ZDlyUiL',
        name: 'Believer (Imagine Dragons cover)',
        type: 'song',
        duration: 202,
        url: 'https://...',
        downloadUrl: [{ quality: '320kbps', url: 'https://...' }],
        image: [{ quality: '500x500', url: 'https://...' }]
      }
    ]
  },
  'song-suggestions': {
    success: true,
    data: [
      { id: '0W6DtW_N', name: 'Believer', type: 'song', duration: 204, url: 'https://...' },
      { id: 'URItmq7h', name: 'Believer', type: 'song', duration: 189, url: 'https://...' }
    ]
  },
  album: {
    success: true,
    data: {
      id: '23241654',
      name: 'Future Nostalgia',
      year: 2020,
      type: 'album',
      songCount: 11,
      language: 'english',
      url: 'https://...',
      artists: { primary: [{ id: '1274170', name: 'Dua Lipa' }] },
      image: [{ quality: '500x500', url: 'https://...' }],
      songs: [{ id: 'abc123', name: "Don't Start Now", type: 'song', duration: 183, url: 'https://...' }]
    }
  },
  artist: {
    success: true,
    data: {
      id: '1274170',
      name: 'Dua Lipa',
      type: 'artist',
      followerCount: 1073559,
      url: 'https://...',
      image: [{ quality: '500x500', url: 'https://...' }],
      topSongs: [{ id: 'abc123', name: 'Levitating', type: 'song' }],
      topAlbums: [{ id: '23241654', name: 'Future Nostalgia', type: 'album' }]
    }
  },
  'artist-by-id': {
    success: true,
    data: {
      id: '1274170',
      name: 'Dua Lipa',
      type: 'artist',
      url: 'https://...',
      topSongs: [{ id: 'abc123', name: 'Levitating', type: 'song' }],
      topAlbums: [{ id: '23241654', name: 'Future Nostalgia', type: 'album' }]
    }
  },
  'artist-songs': {
    success: true,
    data: {
      total: 120,
      songs: [{ id: 'abc123', name: 'Levitating', type: 'song', duration: 203, url: 'https://...' }]
    }
  },
  'artist-albums': {
    success: true,
    data: {
      total: 8,
      albums: [{ id: '23241654', name: 'Future Nostalgia', type: 'album', year: 2020 }]
    }
  },
  playlist: {
    success: true,
    data: {
      id: '82914609',
      name: 'Best of Indie - English',
      type: 'playlist',
      songCount: 40,
      url: 'https://...',
      image: [{ quality: '500x500', url: 'https://...' }],
      songs: [{ id: 'abc123', name: 'Song One', type: 'song', duration: 200, url: 'https://...' }]
    }
  }
};
