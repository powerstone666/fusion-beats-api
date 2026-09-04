import { Endpoints } from '@/lib/common/constants'
import { saavnFetch } from '@/lib/common/helpers'
import { createSongPayload } from '@/lib/modules/songs/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { SongAPIResponseModel, SongModel } from '@/lib/modules/songs/models'
import type { z } from 'zod'

export class GetSongByLinkUseCase implements IUseCase<string, z.infer<typeof SongModel>[]> {
  constructor() {}

  async execute(token: string) {
    const { data } = await saavnFetch<{ songs: z.infer<typeof SongAPIResponseModel>[] }>({
      endpoint: Endpoints.songs.link,
      params: { token, type: 'song' }
    })

    if (!data.songs?.length) throw new HTTPException(404, { message: 'song not found' })

    return data.songs.map((song) => createSongPayload(song))
  }
}
