import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createAlbumPayload } from '@/lib/modules/albums/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { ArtistAlbumAPIResponseModel, ArtistAlbumModel } from '@/lib/modules/artists/models'
import type { z } from 'zod'

export interface GetArtistAlbumsArgs {
  artistId: string
  page: number
  sortBy: 'popularity' | 'latest' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

export class GetArtistAlbumsUseCase implements IUseCase<GetArtistAlbumsArgs, z.infer<typeof ArtistAlbumModel>> {
  constructor() {}

  async execute({ artistId, page, sortOrder, sortBy }: GetArtistAlbumsArgs) {
    const { data } = await saavnFetch<z.infer<typeof ArtistAlbumAPIResponseModel>>({
      endpoint: Endpoints.artists.albums,
      params: {
        artistId,
        page,
        sort_order: sortOrder,
        category: sortBy
      }
    })

    if (!data) throw new HTTPException(404, { message: 'artist albums not found' })

    return {
      total: data.topAlbums.total,
      albums: data.topAlbums.albums.map((album) => createAlbumPayload(album))
    }
  }
}
