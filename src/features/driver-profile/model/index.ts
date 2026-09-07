import { computed, type ComputedRef } from 'vue'
import { useDriversStore } from '@/entities/driver/model/store'
import { useRoundsStore } from '@/entities/round/model/store'
import { useStandingsStore } from '@/entities/standings/model/store'
import { useTeamsStore } from '@/entities/team/model/store'
import { getCircuit } from '@/shared/config/circuits'

/** One round in a driver's season history. */
export interface HistoryEntry {
  round: number
  label: string
  circuit: string
  qualifying: number | null
  finish: number | string
  points: number
  cumulative: number
}

export interface ProfileStats {
  races: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  dnfs: number
  averageFinish: string
}

/** Header details for a driver profile page. */
export interface ProfileHeader {
  id: string
  name: string
  number: number
  nationality: string
  teamId: string
  team: string
  pos: number
  pts: number
}

export const positionHeight = (position: number | string | null): number => {
  if (typeof position !== 'number') return 6

  return Math.max(6, ((11 - Math.min(position, 10)) / 10) * 140)
}

export const valueHeight = (value: number, max: number): number =>
  max > 0 ? Math.max(6, (value / max) * 140) : 6

/**
 * Resolves the driver whose profile is being viewed.
 * @param slug Reactive URL slug, e.g. `saidkamol-inomov`.
 * @param toSlug The slug function used to build driver links.
 */
export const useProfileHeader = (
  slug: ComputedRef<string>,
  toSlug: (value: string) => string,
): ComputedRef<ProfileHeader | undefined> => {
  const drivers = useDriversStore()
  const standings = useStandingsStore()
  const teams = useTeamsStore()

  return computed(() => {
    const driver = drivers.getDriverBySlug(slug.value, toSlug)

    if (!driver) return undefined

    const entry = standings.getDriverStanding(driver.id)

    return {
      id: driver.id,
      name: driver.name,
      number: driver.number,
      nationality: driver.country,
      teamId: driver.teamId,
      team: teams.getTeamName(driver.teamId),
      pos: entry?.position ?? 0,
      pts: entry?.points ?? 0,
    }
  })
}

/**
 * Builds one driver's round-by-round history from the completed round files.
 * Qualifying positions, finishes and fastest laps all come from `data/rounds/`;
 * nothing here is hardcoded.
 *
 * @param driverId Reactive driver id, or `undefined` while the route resolves.
 */
export const useDriverHistory = (
  driverId: ComputedRef<string | undefined>,
): ComputedRef<HistoryEntry[]> => {
  const rounds = useRoundsStore()

  return computed(() => {
    const id = driverId.value

    if (!id) return []

    let cumulative = 0

    return rounds.completedRounds.flatMap((round) => {
      const calendarRound = rounds.getCalendarRound(round)
      const race = rounds.getRaceResults(round).find((result) => result.driverId === id)

      if (!race) return []

      const qualifying = rounds
        .getQualifyingResults(round)
        .find((result) => result.driverId === id)

      cumulative += race.points

      const finish =
        race.status === 'dnf'
          ? 'DNF'
          : race.status === 'dsq'
            ? 'DSQ'
            : (race.position ?? '—')

      return [
        {
          round,
          label: `R${round}`,
          circuit: getCircuit(calendarRound?.country) ?? '',
          qualifying: qualifying?.position ?? null,
          finish,
          points: race.points,
          cumulative,
        },
      ]
    })
  })
}

/** Aggregate season stats for one driver, derived from its history. */
export const useDriverStats = (
  driverId: ComputedRef<string | undefined>,
  history: ComputedRef<HistoryEntry[]>,
): ComputedRef<ProfileStats> => {
  const rounds = useRoundsStore()

  return computed(() => {
    const id = driverId.value
    const entries = history.value

    const finishes = entries
      .map((entry) => entry.finish)
      .filter((finish): finish is number => typeof finish === 'number')

    const fastestLaps = id
      ? rounds.completedRounds.filter((round) =>
          rounds
            .getRaceResults(round)
            .some((result) => result.driverId === id && result.fastestLap),
        ).length
      : 0

    return {
      races: entries.length,
      wins: finishes.filter((finish) => finish === 1).length,
      podiums: finishes.filter((finish) => finish <= 3).length,
      poles: entries.filter((entry) => entry.qualifying === 1).length,
      fastestLaps,
      dnfs: entries.length - finishes.length,
      averageFinish: finishes.length
        ? (finishes.reduce((sum, finish) => sum + finish, 0) / finishes.length).toFixed(1)
        : '—',
    }
  })
}
