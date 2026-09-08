/**
 * Round-level rules shared by the site and the build scripts.
 *
 * Everything here is pure and framework-free: `scripts/buildStandings.ts` and
 * the Pinia stores both read a round through these helpers, so a round is
 * interpreted identically whether it is being rendered or being totalled.
 *
 * Two rules live here.
 *
 * 1. **Absentees.** A round file only lists the drivers who turned up. Every
 *    contracted driver is an entrant for every round, so one missing from a
 *    session is filled in as a `dns`. Reserve drivers are not entrants unless
 *    they were called up, so a reserve missing from a round is left out
 *    entirely rather than marked `dns`.
 *
 * 2. **Who the drive counts for.** A result's `racedFor` names the team the
 *    drive counts for in the constructors' table. It is only written when it
 *    differs from the driver's own seat — which, for a reserve, is always.
 */

import type { Driver } from '../../driver/model/index.ts'
import type { QualifyingResult, RaceResult, Round } from '../model/index.ts'

/** A qualifying entry for a driver who never took part in the session. */
export const qualifyingDidNotStart = (driverId: string): QualifyingResult => ({
  driverId,
  position: null,
  time: '',
  status: 'dns',
})

/** A race entry for a driver who never took the grid. */
export const raceDidNotStart = (driverId: string): RaceResult => ({
  driverId,
  position: null,
  gridPosition: null,
  status: 'dns',
  fastestLap: false,
  points: 0,
})

/**
 * Drivers who are entrants for a round: every contracted driver, plus any
 * reserve the round file actually names.
 */
const entrantsFor = (round: Round | undefined, drivers: Driver[]): Driver[] => {
  const named = new Set([
    ...(round?.qualifying?.results ?? []).map((result) => result.driverId),
    ...(round?.race?.results ?? []).map((result) => result.driverId),
  ])

  return drivers.filter((driver) => driver.teamId !== null || named.has(driver.id))
}

/** Retirements sort behind finishers, and non-starters behind retirements. */
const outcomeRank = (result: QualifyingResult | RaceResult): number => {
  if (result.status === 'dns') return 2
  if (result.position === null) return 1

  return 0
}

/** Orders a classification: by position, then retirements, then non-starters. */
const byClassification = <T extends QualifyingResult | RaceResult>(a: T, b: T): number => {
  const rank = outcomeRank(a) - outcomeRank(b)

  if (rank !== 0) return rank

  return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER)
}

/**
 * A round's qualifying classification with absent entrants filled in as `dns`.
 * @param round The round file, or `undefined` if none exists yet.
 * @param drivers Every registered driver, from `data/drivers.json`.
 */
export const qualifyingEntries = (
  round: Round | undefined,
  drivers: Driver[],
): QualifyingResult[] => {
  const listed = new Map(
    (round?.qualifying?.results ?? []).map((result) => [result.driverId, result]),
  )

  return entrantsFor(round, drivers)
    .map((driver) => listed.get(driver.id) ?? qualifyingDidNotStart(driver.id))
    .sort(byClassification)
}

/**
 * A round's race classification with absent entrants filled in as `dns`.
 * @param round The round file, or `undefined` if none exists yet.
 * @param drivers Every registered driver, from `data/drivers.json`.
 */
export const raceEntries = (round: Round | undefined, drivers: Driver[]): RaceResult[] => {
  const listed = new Map(
    (round?.race?.results ?? []).map((result) => [result.driverId, result]),
  )

  return entrantsFor(round, drivers)
    .map((driver) => listed.get(driver.id) ?? raceDidNotStart(driver.id))
    .sort(byClassification)
}

/**
 * The `racedFor` an admin entered for a driver in a round, from either session.
 *
 * A stand-in only has to be recorded once — on the race entry is the usual
 * place — and the round's other session picks it up. `validateData` rejects a
 * round that names two different teams for the same driver.
 */
export const racedForIn = (
  round: Round | undefined,
  driverId: string,
): string | undefined => {
  const race = (round?.race?.results ?? []).find((result) => result.driverId === driverId)
  const qualifying = (round?.qualifying?.results ?? []).find(
    (result) => result.driverId === driverId,
  )

  return race?.racedFor ?? qualifying?.racedFor
}

/**
 * The team a driver represented in a round: the stand-in team recorded on the
 * round's results, otherwise their own seat.
 *
 * @returns A team id, or `null` for a reserve driver with nothing recorded —
 *   which `validateData` only allows for a round they took no part in.
 */
export const teamForRound = (
  round: Round | undefined,
  driver: Driver | undefined,
): string | null => racedForIn(round, driver?.id ?? '') ?? driver?.teamId ?? null

