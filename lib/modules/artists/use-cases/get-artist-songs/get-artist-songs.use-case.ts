import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createSongPayload } from '@/lib/modules/songs/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { ArtistSongAPIResponseModel, ArtistSongModel } from '@/lib/modules/artists/models'
import type { z } from 'zod'

export interface GetArtistSongsArgs {
  artistId: string
  page: number
  sortBy: 'popularity' | 'latest' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

export class GetArtistSongsUseCase implements IUseCase<GetArtistSongsArgs, z.infer<typeof ArtistSongModel>> {
  constructor() {}

  async execute({ artistId, page, sortOrder, sortBy }: GetArtistSongsArgs) {
    const { data } = await saavnFetch<z.infer<typeof ArtistSongAPIResponseModel>>({
      endpoint: Endpoints.artists.songs,
      params: {
        artistId,
        page,
        sort_order: sortOrder,
        category: sortBy
      }
    })

    if (!data) throw new HTTPException(404, { message: 'artist songs not found' })

    return {
      total: data.topSongs.total,
      songs: data.topSongs.songs.map((song) => createSongPayload(song))
    }
  }
}
