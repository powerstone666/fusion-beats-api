import { Endpoints } from '@/lib/common/constants'
import { ApiContextEnum } from '@/lib/common/enums'
import { saavnFetch } from '@/lib/common/helpers'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'

export class CreateSongStationUseCase implements IUseCase<string, string> {
  constructor() {}

  async execute(songId: string) {
    const encodedSongId = JSON.stringify([encodeURIComponent(songId)])

    const { data, ok } = await saavnFetch<{ stationid: string }>({
      endpoint: Endpoints.songs.station,
      params: {
        entity_id: encodedSongId,
        entity_type: 'queue'
      },
      context: ApiContextEnum.ANDROID
    })

    if (!data || !ok || !data.stationid) throw new HTTPException(500, { message: 'could not create station' })

    return data.stationid
  }
}
