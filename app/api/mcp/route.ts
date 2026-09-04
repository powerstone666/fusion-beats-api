import { createMcpHandler } from 'mcp-handler';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { SearchService } from '@/lib/modules/search/services/search.service';
import { SongService } from '@/lib/modules/songs/services/song.service';
import { extractSongToken } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const searchService = new SearchService();
const songService = new SongService();

function text(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function toolError(e: unknown) {
  const message = e instanceof HTTPException ? e.message : e instanceof Error ? e.message : 'Request failed';
  const status = e instanceof HTTPException ? (e.status || 500) : 500;
  return { content: [{ type: 'text' as const, text: JSON.stringify({ success: false, status, message }) }], isError: true };
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'search_songs',
      {
        title: 'Search songs',
        description: 'Search the music catalog for songs by title, artist or any text. Returns paginated results with IDs for playback.',
        inputSchema: z.object({
          query: z.string().describe('Search text, e.g. "Believer"'),
          page: z.number().int().min(0).default(0).describe('Page number'),
          limit: z.number().int().min(1).max(50).default(10).describe('Results per page')
        })
      },
      async ({ query, page, limit }) => {
        try {
          return text({ success: true, data: await searchService.searchSongs({ query, page, limit }) });
        } catch (e) {
          return toolError(e);
        }
      }
    );

    server.registerTool(
      'search_all',
      {
        title: 'Global search',
        description: 'Search songs, albums, artists and playlists in one call.',
        inputSchema: z.object({
          query: z.string().describe('Search text, e.g. "Imagine Dragons"')
        })
      },
      async ({ query }) => {
        try {
          return text({ success: true, data: await searchService.searchAll(query) });
        } catch (e) {
          return toolError(e);
        }
      }
    );

    server.registerTool(
      'get_song',
      {
        title: 'Get song details',
        description: 'Full details for one or more songs (artwork, artists, album, all download/stream qualities). Pass comma-separated IDs or a direct song link.',
        inputSchema: z.object({
          ids: z.string().optional().describe('Comma-separated song IDs, e.g. "1ZDlyUiL"'),
          link: z.string().optional().describe('Direct song link; the ID token is extracted from it')
        })
      },
      async ({ ids, link }) => {
        try {
          const token = link ? extractSongToken(link) : undefined;
          if (!token && !ids) throw new HTTPException(400, { message: 'Either song IDs or link is required' });
          const data = token
            ? await songService.getSongByLink(token)
            : await songService.getSongByIds({ songIds: ids! });
          return text({ success: true, data });
        } catch (e) {
          return toolError(e);
        }
      }
    );

    server.registerTool(
      'get_stream_url',
      {
        title: 'Get playable stream URL',
        description: 'Resolve the best direct audio stream URL for a song so it can be played or downloaded. Returns the requested quality plus all available qualities.',
        inputSchema: z.object({
          id: z.string().describe('Song ID, e.g. "1ZDlyUiL"'),
          quality: z.enum(['12kbps', '48kbps', '96kbps', '160kbps', '320kbps']).default('320kbps').describe('Preferred audio quality')
        })
      },
      async ({ id, quality }) => {
        try {
          const songs = await songService.getSongByIds({ songIds: id });
          const song = songs[0];
          if (!song) throw new HTTPException(404, { message: 'song not found' });
          const urls = song.downloadUrl ?? [];
          const best = urls.find((d) => d.quality === quality) ?? urls[urls.length - 1];
          if (!best) throw new HTTPException(404, { message: 'no stream available for this song' });
          return text({
            success: true,
            data: {
              id: song.id,
              name: song.name,
              quality: best.quality,
              url: best.url,
              qualities: urls,
              image: song.image,
              artists: song.artists
            }
          });
        } catch (e) {
          return toolError(e);
        }
      }
    );

    server.registerTool(
      'get_suggestions',
      {
        title: 'Get similar songs',
        description: 'Songs similar to the given track, for continuous playback.',
        inputSchema: z.object({
          id: z.string().describe('Seed song ID'),
          limit: z.number().int().min(1).max(25).default(10).describe('Max suggestions')
        })
      },
      async ({ id, limit }) => {
        try {
          return text({ success: true, data: await songService.getSongSuggestions({ songId: id, limit }) });
        } catch (e) {
          return toolError(e);
        }
      }
    );

    server.registerResource(
      'docs',
      'fusion-beats://docs',
      { title: 'Fusion Beats API docs', mimeType: 'text/markdown' },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            text: [
              '# Fusion Beats API (via MCP)',
              '',
              'Base REST URL: same origin as this MCP endpoint, under /api/*.',
              'Every REST endpoint answers `{ success: true, data }`.',
              '',
              '## Tools (preferred)',
              '- search_songs(query, page, limit) → song search',
              '- search_all(query) → songs + albums + artists + playlists',
              '- get_song(ids?, link?) → full details incl. stream URLs',
              '- get_stream_url(id, quality?) → best direct audio URL + all qualities',
              '- get_suggestions(id, limit?) → similar songs',
              '',
              '## REST equivalents',
              '- GET /api/search/songs?query=&page=&limit=',
              '- GET /api/search?query=',
              '- GET /api/songs?ids=&link=  ·  GET /api/songs/:id',
              '- GET /api/songs/:id/suggestions?limit=',
              '- GET /api/albums?id=&link=  ·  GET /api/artists?id=&link=',
              '- GET /api/artists/:id  ·  /:id/songs  ·  /:id/albums',
              '- GET /api/playlists?id=&link=&page=&limit=',
              '',
              'Tip: feed get_stream_url().data.url to any audio player to stream.'
            ].join('\n')
          }
        ]
      })
    );
  },
  { serverInfo: { name: 'fusion-beats-api', version: '1.0.0' } }
);

export { handler as GET, handler as POST, handler as DELETE };
