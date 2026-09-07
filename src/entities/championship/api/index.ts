import championshipJson from '@data/championship.json'
import type { Championship, ScoringTable } from '../model'

const championship = championshipJson as Championship

/**
 * Returns the season metadata block from `data/championship.json`.
 * Shape is guaranteed by `scripts/validateData.ts`, which runs before every build.
 */
export const getChampionship = (): Championship => championship

/** Returns the points-per-position table used for scoring races. */
export const getScoringTable = (): ScoringTable => championship.scoring

/**
 * Points awarded for a finishing position, or 0 for positions outside the table.
 * @param position 1-based finishing position.
 */
export const pointsForPosition = (position: number): number =>
  championship.scoring[String(position)] ?? 0

/**
 * Whether a driver finishing in `position` may collect the fastest-lap bonus.
 * @param position 1-based finishing position.
 */
export const isFastestLapEligible = (position: number): boolean =>
  championship.bonusPoints.fastestLapEligibility === 'any' || position <= 10

/** Bonus points awarded for setting the fastest lap. */
export const getFastestLapBonus = (): number => championship.bonusPoints.fastestLap
