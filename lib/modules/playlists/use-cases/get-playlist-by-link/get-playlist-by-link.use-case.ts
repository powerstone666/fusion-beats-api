import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createPlaylistPayload } from '@/lib/modules/playlists/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { PlaylistAPIResponseModel, PlaylistModel } from '@/lib/modules/playlists/models'
import type { z } from 'zod'

export interface GetPlaylistByLinkArgs {
  token: string
  limit: number
  page: number
}

export class GetPlaylistByLinkUseCase implements IUseCase<GetPlaylistByLinkArgs, z.infer<typeof PlaylistModel>> {
  constructor() {}

  async execute({ token, limit, page }: GetPlaylistByLinkArgs) {
    const { data } = await saavnFetch<z.infer<typeof PlaylistAPIResponseModel>>({
      endpoint: Endpoints.albums.link,
      params: {
        token,
        n: limit,
        p: page,
        type: 'playlist'
      }
    })

    if (!data) throw new HTTPException(404, { message: 'playlist not found' })

    const playlist = createPlaylistPayload(data)

    return {
      ...playlist,
      songCount: playlist?.songs?.length || null,
      songs: playlist?.songs?.slice(0, limit) || []
    }
  }
}
