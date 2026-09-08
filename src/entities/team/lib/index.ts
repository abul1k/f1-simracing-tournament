/** Livery-aware presentation helpers, keyed by team id. */

import { FALLBACK_COLOR, gradientFrom, inkFor, isLight, type Ink } from '@/shared/lib/color'
import { getTeamById } from '../api'

/**
 * The team's livery colour.
 * @param id A team id such as `TEAM_MER`. Unknown ids, and the `null` carried by
 *   a reserve driver with no seat, fall back to neutral grey.
 */
export const teamColor = (id: string | null): string =>
  getTeamById(id)?.color ?? FALLBACK_COLOR

/** The team's livery as a podium gradient. */
export const teamGradient = (id: string | null): string => gradientFrom(teamColor(id))

/** Text and divider colours readable on top of the team's livery. */
export const teamInk = (id: string | null): Ink => inkFor(teamColor(id))

/** Whether the team's livery is light enough to need dark text. */
export const isLightTeam = (id: string | null): boolean => isLight(teamColor(id))
