import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createSearchPayload } from '@/lib/modules/search/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { SearchAPIResponseModel, SearchModel } from '@/lib/modules/search/models'
import type { z } from 'zod'

export class SearchAllUseCase implements IUseCase<string, z.infer<typeof SearchModel>> {
  async execute(query: string): Promise<z.infer<typeof SearchModel>> {
    const { data } = await saavnFetch<z.infer<typeof SearchAPIResponseModel>>({
      endpoint: Endpoints.search.all,
      params: { query }
    })

    if (!data) throw new HTTPException(404, { message: `no results found for ${query}` })

    return createSearchPayload(data)
  }
}
