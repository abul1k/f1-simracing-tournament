import { computed, type ComputedRef } from 'vue'
import { useChampionshipStore } from '@/entities/championship/model/store'
import { useDriversStore } from '@/entities/driver/model/store'
import { useRoundsStore } from '@/entities/round/model/store'
import { useTeamsStore } from '@/entities/team/model/store'

export interface InfoItem {
  value: string | number
  label: string
}

/** Headline details for the season banner. */
export interface SeasonHeader {
  eyebrow: string
  title: string
  region: string
  game: string
  status: string
}

/** The season banner's heading, read from `data/championship.json`. */
export const useSeasonHeader = (): ComputedRef<SeasonHeader> => {
  const store = useChampionshipStore()

  return computed(() => {
    const { game, platform, region, season, status } = store.championship

    return {
      eyebrow: `${game} CHAMPIONSHIP`.toUpperCase(),
      title: `Season ${season}`,
      region,
      game: `${game} · ${platform}`,
      status: `STATUS: ${status === 'active' ? 'LIVE' : status.toUpperCase()}`,
    }
  })
}

/** The counters under the season banner. */
export const useSeasonInfo = (): ComputedRef<InfoItem[]> => {
  const championship = useChampionshipStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()
  const rounds = useRoundsStore()

  return computed(() => {
    const total = championship.roundsTotal
    const done = rounds.completedRounds.length

    return [
      { value: total, label: 'ROUNDS' },
      { value: drivers.driverCount, label: 'DRIVERS' },
      { value: drivers.reserveCount, label: 'RESERVES' },
      { value: teams.teamCount, label: 'TEAMS' },
      { value: `ROUND ${done} / ${total}`, label: 'SEASON PROGRESS' },
    ]
  })
}
