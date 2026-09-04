import { SongService } from '@/lib/modules/songs/services/song.service';
import { handleError, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const songService = new SongService();

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await songService.getSongByIds({ songIds: id });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
