import { ArtistService } from '@/lib/modules/artists/services/artist.service';
import { handleError, numParam, ok, sortByParam, sortOrderParam } from '@/lib/api-helpers';

export const revalidate = 300;

const artistService = new ArtistService();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const searchParams = new URL(req.url).searchParams;

    const data = await artistService.getArtistAlbums({
      artistId: id,
      page: numParam(searchParams, 'page', 0),
      sortBy: sortByParam(searchParams, 'popularity'),
      sortOrder: sortOrderParam(searchParams, 'desc')
    });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
