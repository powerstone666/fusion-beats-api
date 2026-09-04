import { PlaylistService } from '@/lib/modules/playlists/services/playlist.service';
import { extractPlaylistToken, fail, handleError, numParam, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const playlistService = new PlaylistService();

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get('id');
    const token = extractPlaylistToken(searchParams.get('link'));
    const page = numParam(searchParams, 'page', 0);
    const limit = numParam(searchParams, 'limit', 10);

    if (!token && !id) {
      return fail('Either playlist ID or link is required', 400);
    }

    const data = token
      ? await playlistService.getPlaylistByLink({ token, page, limit })
      : await playlistService.getPlaylistById({ id: id!, page, limit });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
