import { computed, type ComputedRef } from 'vue'
import { useDriversStore } from '@/entities/driver/model/store'
import { useStandingsStore } from '@/entities/standings/model/store'
import { useTeamsStore } from '@/entities/team/model/store'

/** One row of the compact standings table shown on the home page. */
export interface StandingRow {
  pos: number
  driver: string
  teamId: string
  team: string
  pts: number
  country: string
}

export const previewCount = 5

export const ordinals: Record<number, string> = {
  1: 'ST',
  2: 'ND',
  3: 'RD',
}

export const podiumHeights: Record<number, string> = {
  1: '240px',
  2: '220px',
  3: '200px',
}

/** Splits a full name so the surname can be emphasised on the podium cards. */
export const splitName = (name: string): { first: string; last: string } => {
  const [first, ...rest] = name.split(' ')

  return rest.length ? { first, last: rest.join(' ') } : { first: '', last: first }
}

/** Home-page standings rows, read from the precomputed `data/standings.json`. */
export const useChampionshipStandings = (): ComputedRef<StandingRow[]> => {
  const standings = useStandingsStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()

  return computed(() =>
    standings.driverStandings.map((entry) => {
      const driver = drivers.getDriverById(entry.driverId)

      return {
        pos: entry.position,
        driver: driver?.name ?? entry.driverId,
        teamId: driver?.teamId ?? '',
        team: driver ? teams.getTeamName(driver.teamId) : '',
        pts: entry.points,
        country: driver?.country ?? '',
      }
    }),
  )
}
