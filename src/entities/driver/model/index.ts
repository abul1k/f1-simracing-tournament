import type { Team } from '@/entities/team/model'

export interface Driver {
  id: string
  name: string
  number: number
  teamId: string
  country: string
}

/** A driver joined with the team record its `teamId` points at. */
export interface DriverWithTeam extends Driver {
  team: Team | undefined
}
