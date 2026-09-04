import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createSearchAlbumPayload } from '@/lib/modules/search/helpers'
import type { IUseCase } from '@/lib/common/types'
import type { SearchAlbumAPIResponseModel, SearchAlbumModel } from '@/lib/modules/search/models'
import type { z } from 'zod'

export interface SearchAlbumsArgs {
  query: string
  page: number
  limit: number
}

export class SearchAlbumsUseCase implements IUseCase<SearchAlbumsArgs, z.infer<typeof SearchAlbumModel>> {
  constructor() {}

  async execute({ query, limit, page }: SearchAlbumsArgs): Promise<z.infer<typeof SearchAlbumModel>> {
    const { data } = await saavnFetch<z.infer<typeof SearchAlbumAPIResponseModel>>({
      endpoint: Endpoints.search.albums,
      params: {
        q: query,
        p: page,
        n: limit
      }
    })

    return createSearchAlbumPayload(data)
  }
}
