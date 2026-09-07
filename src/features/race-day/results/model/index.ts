import { computed, type ComputedRef } from 'vue'
import { getDriverCode } from '@/entities/driver/api'
import { useChampionshipStore } from '@/entities/championship/model/store'
import { useDriversStore } from '@/entities/driver/model/store'
import { useRoundsStore } from '@/entities/round/model/store'
import { useTeamsStore } from '@/entities/team/model/store'

/** One row of a session classification table. */
export interface SessionResultRow {
  pos: number | string
  no: number
  driver: string
  code: string
  teamId: string
  team: string
  /**
   * Qualifying only — race results carry no lap time in `data/rounds/`.
   * Empty for a driver who set no time; `status` says why.
   */
  time?: string
  /** Race only — the driver's starting position, null for a driver who never started. */
  grid?: number | null
  /** `DNF`/`DSQ`/`DNS`, or empty for a clean lap or a classified finish. */
  status?: string
  /** Race only — championship points scored, fastest-lap bonus included. */
  points?: number
  /**
   * Race only — the fastest-lap bonus contained in `points`, so the table can
   * show the breakdown. Zero unless the driver both set the fastest lap and
   * finished inside the eligible positions.
   */
  bonus?: number
}

/** Session keys that read a round's qualifying classification. */
const QUALIFYING_KEYS = ['qualifying', 'sprint-qualifying']

/** Session keys that read a round's race classification. */
const RACE_KEYS = ['race', 'sprint']

/** `dnf` → `DNF`; a clean result has nothing to flag. */
const statusLabel = (status?: string): string =>
  !status || status === 'finished' ? '' : status.toUpperCase()

/**
 * Classification rows for one session of one round.
 *
 * Returns an empty list for sessions the data does not cover (practice), and for
 * sessions still marked `pending` in the round file.
 *
 * @param round Reactive round number from the route.
 * @param sessionKey Reactive session key, e.g. `qualifying` or `race`.
 */
export const useSessionResults = (
  round: ComputedRef<number | undefined>,
  sessionKey: ComputedRef<string | undefined>,
): ComputedRef<SessionResultRow[]> => {
  const rounds = useRoundsStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()
  const championship = useChampionshipStore()

  return computed(() => {
    const number = round.value
    const key = sessionKey.value

    if (number === undefined || !key) return []

    const describe = (driverId: string) => {
      const driver = drivers.getDriverById(driverId)

      return {
        no: driver?.number ?? 0,
        driver: driver?.name ?? driverId,
        code: getDriverCode(driverId),
        teamId: driver?.teamId ?? '',
        team: driver ? teams.getTeamName(driver.teamId) : '',
      }
    }

    if (QUALIFYING_KEYS.includes(key)) {
      return rounds.getQualifyingResults(number).map((result) => ({
        pos: result.position,
        ...describe(result.driverId),
        // Empty when the driver set no time — the table falls back to `status`.
        time: result.time,
        status: statusLabel(result.status),
      }))
    }

    if (RACE_KEYS.includes(key)) {
      return rounds.getRaceResults(number).map((result) => {
        // Mirrors scripts/calculatePoints.ts: the bonus only lands for a
        // classified finisher inside the eligible positions.
        const earnedBonus =
          result.status === 'finished' &&
          result.fastestLap &&
          result.position !== null &&
          championship.isFastestLapEligible(result.position)

        return {
          pos: result.position ?? statusLabel(result.status),
          ...describe(result.driverId),
          grid: result.gridPosition,
          status: result.status === 'finished' ? 'FINISHED' : statusLabel(result.status),
          points: result.points,
          bonus: earnedBonus ? championship.fastestLapBonus : 0,
        }
      })
    }

    return []
  })
}
