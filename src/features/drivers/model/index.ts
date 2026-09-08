import { computed, type ComputedRef } from 'vue'
import { useDriversStore } from '@/entities/driver/model/store'
import { useStandingsStore } from '@/entities/standings/model/store'
import { useTeamsStore } from '@/entities/team/model/store'

/** One driver card in the drivers grid. */
export interface DriverProfile {
  id: string
  name: string
  number: number
  nationality: string
  /** null for a reserve driver — `team` then reads `Reserve Driver`. */
  teamId: string | null
  team: string
  pts: number
  wins: number
  podiums: number
}

export type SortKey = 'POSITION' | 'POINTS' | 'WINS' | 'NUMBER'

export const sortKeys: SortKey[] = ['POSITION', 'POINTS', 'WINS', 'NUMBER']

export const sorters: Record<SortKey, (a: DriverProfile, b: DriverProfile) => number> = {
  POSITION: () => 0,
  POINTS: (a, b) => b.pts - a.pts,
  WINS: (a, b) => b.wins - a.wins,
  NUMBER: (a, b) => a.number - b.number,
}

export type StatusKey = 'ALL' | 'SCORED' | 'NO POINTS'

export const statusKeys: StatusKey[] = ['ALL', 'SCORED', 'NO POINTS']

export const matchesStatus = (driver: DriverProfile, status: StatusKey): boolean => {
  if (status === 'SCORED') return driver.pts > 0
  if (status === 'NO POINTS') return driver.pts === 0

  return true
}

/**
 * Driver cards in championship order, joining `data/drivers.json` with the
 * points, wins and podiums already computed into `data/standings.json`.
 */
export const useDriverCards = (): ComputedRef<DriverProfile[]> => {
  const drivers = useDriversStore()
  const standings = useStandingsStore()
  const teams = useTeamsStore()

  return computed(() =>
    standings.driverStandings.flatMap((entry) => {
      const driver = drivers.getDriverById(entry.driverId)

      if (!driver) return []

      return [
        {
          id: driver.id,
          name: driver.name,
          number: driver.number,
          nationality: driver.country,
          teamId: driver.teamId,
          team: teams.getTeamName(driver.teamId),
          pts: entry.points,
          wins: entry.wins,
          podiums: entry.podiums,
        },
      ]
    }),
  )
}
