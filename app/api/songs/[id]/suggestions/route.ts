import { SongService } from '@/lib/modules/songs/services/song.service';
import { handleError, numParam, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const songService = new SongService();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await songService.getSongSuggestions({
      songId: id,
      limit: numParam(new URL(req.url).searchParams, 'limit', 10)
    });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
