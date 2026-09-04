import { SongService } from '@/lib/modules/songs/services/song.service';
import { extractSongToken, fail, handleError, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const songService = new SongService();

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const ids = searchParams.get('ids');
    const token = extractSongToken(searchParams.get('link'));

    if (!token && !ids) {
      return fail('Either song IDs or link is required', 400);
    }

    const data = token
      ? await songService.getSongByLink(token)
      : await songService.getSongByIds({ songIds: ids! });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
