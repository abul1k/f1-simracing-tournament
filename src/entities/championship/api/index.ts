import championshipJson from '@data/championship.json'
import type { RaceType } from '@/entities/round/model'
import type { Championship, ScoringTable } from '../model'

const championship = championshipJson as Championship

/**
 * Returns the season metadata block from `data/championship.json`.
 * Shape is guaranteed by `scripts/validateData.ts`, which runs before every build.
 */
export const getChampionship = (): Championship => championship

/**
 * Returns the points-per-position table a race of this type scores on.
 * @param type The round's race type, from `data/calendar.json`.
 */
export const getScoringTable = (type: RaceType): ScoringTable =>
  type === 'SPRINT RACE' ? championship.sprintScoring : championship.scoring

/**
 * Points awarded for a finishing position, or 0 for positions outside the table.
 * @param position 1-based finishing position.
 * @param type The round's race type — sprints score on a shorter table.
 */
export const pointsForPosition = (position: number, type: RaceType): number =>
  getScoringTable(type)[String(position)] ?? 0

/**
 * Whether a driver finishing in `position` may collect the fastest-lap bonus.
 *
 * A sprint never carries the bonus — its points come from position alone — so
 * this is always false for one, whatever `fastestLapEligibility` says.
 *
 * @param position 1-based finishing position.
 * @param type The round's race type, from `data/calendar.json`.
 */
export const isFastestLapEligible = (position: number, type: RaceType): boolean =>
  type !== 'SPRINT RACE' &&
  (championship.bonusPoints.fastestLapEligibility === 'any' || position <= 10)

/** Bonus points awarded for setting the fastest lap. */
export const getFastestLapBonus = (): number => championship.bonusPoints.fastestLap
