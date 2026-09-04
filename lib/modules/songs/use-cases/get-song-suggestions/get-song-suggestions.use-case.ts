import { Endpoints } from '@/lib/common/constants'
import { ApiContextEnum } from '@/lib/common/enums'
import { saavnFetch } from '@/lib/common/helpers'
import { createSongPayload } from '@/lib/modules/songs/helpers'
import { CreateSongStationUseCase, GetSongByIdUseCase } from '@/lib/modules/songs/use-cases'
import { SearchSongsUseCase } from '@/lib/modules/search/use-cases'
import { HTTPException } from 'hono/http-exception'
import type { IUseCase } from '@/lib/common/types'
import type { SongModel, SongSuggestionAPIResponseModel } from '@/lib/modules/songs/models'
import type { z } from 'zod'

export interface GetSongSuggestionsArgs {
  songId: string
  limit: number
}

export class GetSongSuggestionsUseCase implements IUseCase<GetSongSuggestionsArgs, z.infer<typeof SongModel>[]> {
  private readonly createSongStation: CreateSongStationUseCase
  private readonly getSongById: GetSongByIdUseCase
  private readonly searchSongs: SearchSongsUseCase

  constructor() {
    this.createSongStation = new CreateSongStationUseCase()
    this.getSongById = new GetSongByIdUseCase()
    this.searchSongs = new SearchSongsUseCase()
  }

  async execute({ songId, limit }: GetSongSuggestionsArgs) {
    // Primary: JioSaavn radio station (works where radio is available).
    const radio = await this.radioSuggestions(songId, limit).catch(() => [])
    if (radio.length) return radio

    // Fallback: more songs by the same artist (radio is geo-restricted and
    // upstream often answers { stationid, error: 'No new song found...' }).
    return this.relatedSuggestions(songId, limit)
  }

  private async radioSuggestions(songId: string, limit: number) {
    const stationId = await this.createSongStation.execute(songId)

    const { data, ok } = await saavnFetch<z.infer<typeof SongSuggestionAPIResponseModel>>({
      endpoint: Endpoints.songs.suggestions,
      params: {
        stationid: stationId,
        k: limit
      },
      context: ApiContextEnum.ANDROID
    })

    if (!data || !ok) return []

    const { stationid: _stationid, ...suggestions } = data
    void _stationid

    // Upstream sometimes answers { stationid, error: '...' } with no songs.
    const entries = Object.values(suggestions).filter(
      (element): element is { song: Parameters<typeof createSongPayload>[0] } =>
        !!element && typeof element === 'object' && 'song' in element && !!(element as { song?: unknown }).song
    )

    return entries.map((element) => createSongPayload(element.song)).slice(0, limit)
  }

  private async relatedSuggestions(songId: string, limit: number) {
    const songs = await this.getSongById.execute({ songIds: songId }).catch(() => [])
    const song = songs[0]
    const artistName = song?.artists?.primary?.[0]?.name || song?.artists?.all?.[0]?.name
    // e.g. "Believer (Imagine Dragons cover)" -> "Believer"
    const titleQuery = song?.name
      ?.replace(/\(.*?\)/g, ' ')
      .split(/[^a-zA-Z0-9]+/)
      .filter((w) => w.length > 3)
      .slice(0, 2)
      .join(' ')

    for (const query of [artistName, titleQuery].filter(Boolean) as string[]) {
      const search = await this.searchSongs.execute({ query, page: 0, limit: limit + 5 }).catch(() => null)
      const ids = (search?.results ?? [])
        .map((item) => item.id)
        .filter((id) => id && id !== songId)
        .slice(0, limit)

      if (ids.length) {
        const related = await this.getSongById.execute({ songIds: ids.join(',') }).catch(() => [])
        if (related.length) return related.slice(0, limit)
      }
    }

    throw new HTTPException(404, { message: 'no suggestions found for the given song' })
  }
}
