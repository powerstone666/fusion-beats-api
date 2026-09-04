import { SearchService } from '@/lib/modules/search/services/search.service';
import { fail, handleError, ok } from '@/lib/api-helpers';

export const revalidate = 300;

const searchService = new SearchService();

export async function GET(req: Request) {
  try {
    const query = new URL(req.url).searchParams.get('query');
    if (!query) return fail('query is required', 400);

    const data = await searchService.searchAll(query);
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
