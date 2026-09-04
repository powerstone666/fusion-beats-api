import { AlbumService } from '@/lib/modules/albums/services/album.service';
import { extractAlbumToken, fail, handleError, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const albumService = new AlbumService();

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get('id');
    const token = extractAlbumToken(searchParams.get('link'));

    if (!token && !id) {
      return fail('Either album ID or link is required', 400);
    }

    const data = token
      ? await albumService.getAlbumByLink(token)
      : await albumService.getAlbumById(id!);
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
