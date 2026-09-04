import { ArtistService } from '@/lib/modules/artists/services/artist.service';
import {
  extractArtistToken,
  fail,
  handleError,
  numParam,
  ok,
  sortByParam,
  sortOrderParam
} from '@/lib/api-helpers';

export const revalidate = 300;

const artistService = new ArtistService();

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get('id');
    const token = extractArtistToken(searchParams.get('link'));

    if (!token && !id) {
      return fail('Either artist ID or link is required', 400);
    }
    const page = numParam(searchParams, 'page', 0);
    const songCount = numParam(searchParams, 'songCount', 10);
    const albumCount = numParam(searchParams, 'albumCount', 10);
    const sortBy = sortByParam(searchParams, 'popularity');
    const sortOrder = sortOrderParam(searchParams, 'asc');

    const data = token
      ? await artistService.getArtistByLink({ token, page, songCount, albumCount, sortBy, sortOrder })
      : await artistService.getArtistById({
          artistId: id!,
          page,
          songCount,
          albumCount,
          sortBy,
          sortOrder
        });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
