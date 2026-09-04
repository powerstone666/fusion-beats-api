import { SearchService } from '@/lib/modules/search/services/search.service';
import { fail, handleError, numParam, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const searchService = new SearchService();

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get('query');
    if (!query) return fail('query is required', 400);

    const data = await searchService.searchSongs({
      query,
      page: numParam(searchParams, 'page', 0),
      limit: numParam(searchParams, 'limit', 10)
    });
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
