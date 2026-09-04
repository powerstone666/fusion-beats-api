import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createPlaylistPayload } from '@/lib/modules/playlists/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { PlaylistAPIResponseModel, PlaylistModel } from '@/lib/modules/playlists/models'
import type { z } from 'zod'

export interface GetPlaylistByIdArgs {
  id: string
  limit: number
  page: number
}

export class GetPlaylistByIdUseCase implements IUseCase<GetPlaylistByIdArgs, z.infer<typeof PlaylistModel>> {
  constructor() {}

  async execute({ id, limit, page }: GetPlaylistByIdArgs) {
    const { data } = await saavnFetch<z.infer<typeof PlaylistAPIResponseModel>>({
      endpoint: Endpoints.playlists.id,
      params: {
        listid: id,
        n: limit,
        p: page
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
