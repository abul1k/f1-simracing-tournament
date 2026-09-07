import teamsJson from '@data/teams.json'
import type { Team } from '../model'

const teams = teamsJson as Team[]

const byId = new Map(teams.map((team) => [team.id, team]))

/** Returns every team in the championship, in `data/teams.json` order. */
export const getTeams = (): Team[] => teams

/**
 * Looks up a single team.
 * @param id A team id such as `TEAM_MER`.
 * @returns The team, or `undefined` if no team carries that id.
 */
export const getTeamById = (id: string): Team | undefined => byId.get(id)

/**
 * The team's livery colour, falling back to neutral grey for an unknown id.
 * @param id A team id such as `TEAM_MER`.
 */
export const getTeamColor = (id: string): string => byId.get(id)?.color ?? '#68686D'

/** The team's display name, falling back to the raw id if it is unknown. */
export const getTeamName = (id: string): string => byId.get(id)?.name ?? id
