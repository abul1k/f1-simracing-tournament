import type { Team } from '@/entities/team/model'

export interface Driver {
  id: string
  name: string
  number: number
  /**
   * The driver's permanent seat, or `null` for a reserve driver.
   *
   * A reserve has no seat of their own: admins call one up when a contracted
   * driver cannot race, and the round's results record which team they stood in
   * for as `racedFor`. See `teamForRound` in `@/entities/round/lib`.
   */
  teamId: string | null
  country: string
}

/** True for a driver with no permanent seat — one of the reserve pool. */
export const isReserveDriver = (driver: Driver): boolean => driver.teamId === null

/** A driver joined with the team record its `teamId` points at. */
export interface DriverWithTeam extends Driver {
  team: Team | undefined
}
