import { computed, type ComputedRef } from 'vue'
import { useDriversStore } from '@/entities/driver/model/store'
import { useStandingsStore } from '@/entities/standings/model/store'
import { useTeamsStore } from '@/entities/team/model/store'
import { isRetired, type RoundOutcome } from '@/entities/round/model'

export type RoundResult = RoundOutcome

export { isRetired }

/** One row of the drivers' championship table. */
export interface DriverStanding {
  pos: number
  driver: string
  nationality: string
  /** null for a reserve driver — `team` then reads `Reserve Driver`. */
  teamId: string | null
  team: string
  results: RoundResult[]
  pts: number
}

/** One row of the constructors' championship table. */
export interface ConstructorStanding {
  pos: number
  teamId: string
  team: string
  drivers: string[]
  pts: number
}

/**
 * Round numbers behind the results columns, in the order they appear in each
 * driver's `results` array.
 *
 * These are real round numbers, not positions: if rounds 1 and 3 are complete
 * while 2 is still pending, this returns `[1, 3]` so the columns read R1 and R3
 * rather than R1 and R2.
 */
export const useCompletedRounds = (): ComputedRef<number[]> => {
  const standings = useStandingsStore()

  return computed(() => standings.roundsCompleted)
}

/**
 * Drivers' championship rows, read from the precomputed `data/standings.json`.
 * Standings are never aggregated in the browser — see `scripts/buildStandings.ts`.
 */
export const useDriverStandings = (): ComputedRef<DriverStanding[]> => {
  const standings = useStandingsStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()

  return computed(() =>
    standings.driverStandings.map((entry) => {
      const driver = drivers.getDriverById(entry.driverId)

      return {
        pos: entry.position,
        driver: driver?.name ?? entry.driverId,
        nationality: driver?.country ?? '',
        teamId: driver?.teamId ?? null,
        team: driver ? teams.getTeamName(driver.teamId) : '',
        results: entry.results,
        pts: entry.points,
      }
    }),
  )
}

/** Constructors' championship rows, also read straight from `data/standings.json`. */
export const useConstructorStandings = (): ComputedRef<ConstructorStanding[]> => {
  const standings = useStandingsStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()

  return computed(() =>
    standings.constructorStandings.map((entry) => ({
      pos: entry.position,
      teamId: entry.teamId,
      team: teams.getTeamName(entry.teamId),
      // Contracted drivers plus any reserve who stood in for the team, as
      // worked out by scripts/buildStandings.ts.
      drivers: entry.driverIds.map(
        (driverId) => drivers.getDriverById(driverId)?.name ?? driverId,
      ),
      pts: entry.points,
    })),
  )
}
