/**
 * Shown wherever a driver has no team to name: a reserve driver away from a
 * round, or a round a reserve was not called up for.
 */
export const NO_TEAM_LABEL = 'Reserve Driver'

export interface Team {
  id: string
  name: string
  shortName: string
  color: string
}
