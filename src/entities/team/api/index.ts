import teamsJson from '@data/teams.json'
import { FALLBACK_COLOR } from '@/shared/lib/color'
import { NO_TEAM_LABEL, type Team } from '../model'

const teams = teamsJson as Team[]

const byId = new Map(teams.map((team) => [team.id, team]))

/** Returns every team in the championship, in `data/teams.json` order. */
export const getTeams = (): Team[] => teams

/**
 * Looks up a single team.
 * @param id A team id such as `TEAM_MER`, or `null` for a driver with no team.
 * @returns The team, or `undefined` if no team carries that id.
 */
export const getTeamById = (id: string | null): Team | undefined =>
  id === null ? undefined : byId.get(id)

/**
 * The team's livery colour, falling back to neutral grey for an unknown id and
 * for `null` — a reserve driver has no livery of their own.
 * @param id A team id such as `TEAM_MER`, or `null`.
 */
export const getTeamColor = (id: string | null): string =>
  getTeamById(id)?.color ?? FALLBACK_COLOR

/**
 * The team's display name.
 * @param id A team id such as `TEAM_MER`, or `null` for a driver with no team.
 * @returns The team name, `Reserve Driver` for `null`, or the raw id if unknown.
 */
export const getTeamName = (id: string | null): string =>
  id === null ? NO_TEAM_LABEL : (byId.get(id)?.name ?? id)
