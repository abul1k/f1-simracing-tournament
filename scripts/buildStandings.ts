/**
 * Aggregates completed rounds into `data/standings.json`.
 *
 * This is the only standings source the site reads — the frontend never sums
 * round files in the browser. Rounds whose `race.status` is not `completed`
 * are skipped entirely, so a half-entered round never leaks onto the site.
 *
 * Tie-break (both tables): most wins, then most 2nd places, then 3rds, and so
 * on until the tie breaks — the standard countback rule. Drivers still level
 * are ordered by car number; teams by their order in `data/teams.json`.
 *
 * Usage: `node scripts/buildStandings.ts`
 */

import type { Driver } from '../src/entities/driver/model/index.ts'
import type { RaceResult, Round, RoundOutcome } from '../src/entities/round/model/index.ts'
import type { Team } from '../src/entities/team/model/index.ts'
import type {
  ConstructorStandingEntry,
  DriverStandingEntry,
  Standings,
} from '../src/entities/standings/model/index.ts'
import {
  DRIVERS_FILE,
  STANDINGS_FILE,
  TEAMS_FILE,
  listRoundFiles,
  readJson,
  writeJson,
} from './lib/dataFiles.ts'

const drivers = readJson<Driver[]>(DRIVERS_FILE)
const teams = readJson<Team[]>(TEAMS_FILE)

const completedRounds = listRoundFiles()
  .map((file) => readJson<Round>(file))
  .filter((round) => round.race.status === 'completed')
  .sort((a, b) => a.round - b.round)

const roundNumbers = completedRounds.map((round) => round.round)

/** Turns a race result into the marker shown in a results grid. */
const outcomeOf = (result: RaceResult): RoundOutcome => {
  if (result.status === 'dnf') return 'DNF'
  if (result.status === 'dsq') return 'DSQ'

  return result.position ?? '—'
}

/**
 * Counts finishing positions, indexed by position (`counts[1]` = wins).
 * Only classified finishes count; a DNF or DSQ contributes nothing.
 */
const countbackOf = (results: RaceResult[]): number[] => {
  const counts: number[] = []

  results.forEach((result) => {
    if (result.status !== 'finished' || result.position === null) return

    counts[result.position] = (counts[result.position] ?? 0) + 1
  })

  return counts
}

/**
 * Compares two countback tallies, best-placed first.
 * @returns Negative if `a` outranks `b`, positive if `b` outranks `a`, 0 if level.
 */
const compareCountback = (a: number[], b: number[]): number => {
  const length = Math.max(a.length, b.length)

  for (let position = 1; position < length; position += 1) {
    const difference = (b[position] ?? 0) - (a[position] ?? 0)

    if (difference !== 0) return difference
  }

  return 0
}

interface Tally {
  points: number
  results: RaceResult[]
  outcomes: RoundOutcome[]
}

const emptyTally = (): Tally => ({ points: 0, results: [], outcomes: [] })

const tallies = new Map<string, Tally>(
  drivers.map((driver) => [driver.id, emptyTally()]),
)

completedRounds.forEach((round) => {
  const byDriver = new Map(round.race.results.map((result) => [result.driverId, result]))

  drivers.forEach((driver) => {
    const tally = tallies.get(driver.id)

    if (!tally) return

    const result = byDriver.get(driver.id)

    if (!result) {
      tally.outcomes.push('—')

      return
    }

    tally.points += result.points ?? 0
    tally.results.push(result)
    tally.outcomes.push(outcomeOf(result))
  })
})

const winsOf = (results: RaceResult[]): number =>
  results.filter((result) => result.status === 'finished' && result.position === 1).length

const podiumsOf = (results: RaceResult[]): number =>
  results.filter(
    (result) =>
      result.status === 'finished' && result.position !== null && result.position <= 3,
  ).length

const driverNumber = new Map(drivers.map((driver) => [driver.id, driver.number]))

const driverStandings: DriverStandingEntry[] = drivers
  .map((driver) => {
    const tally = tallies.get(driver.id) ?? emptyTally()

    return {
      position: 0,
      driverId: driver.id,
      points: tally.points,
      wins: winsOf(tally.results),
      podiums: podiumsOf(tally.results),
      results: tally.outcomes,
      countback: countbackOf(tally.results),
    }
  })
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points

    const countback = compareCountback(a.countback, b.countback)

    if (countback !== 0) return countback

    return (driverNumber.get(a.driverId) ?? 0) - (driverNumber.get(b.driverId) ?? 0)
  })
  .map(({ countback: _countback, ...entry }, index) => ({ ...entry, position: index + 1 }))

const teamOrder = new Map(teams.map((team, index) => [team.id, index]))

const driversByTeam = new Map<string, Driver[]>(
  teams.map((team) => [
    team.id,
    drivers.filter((driver) => driver.teamId === team.id),
  ]),
)

const constructorStandings: ConstructorStandingEntry[] = teams
  .map((team) => {
    const roster = driversByTeam.get(team.id) ?? []
    const results = roster.flatMap((driver) => tallies.get(driver.id)?.results ?? [])
    const points = roster.reduce(
      (sum, driver) => sum + (tallies.get(driver.id)?.points ?? 0),
      0,
    )

    return {
      position: 0,
      teamId: team.id,
      points,
      wins: winsOf(results),
      podiums: podiumsOf(results),
      countback: countbackOf(results),
    }
  })
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points

    const countback = compareCountback(a.countback, b.countback)

    if (countback !== 0) return countback

    return (teamOrder.get(a.teamId) ?? 0) - (teamOrder.get(b.teamId) ?? 0)
  })
  .map(({ countback: _countback, ...entry }, index) => ({ ...entry, position: index + 1 }))

const standings: Standings = {
  generatedAt: new Date().toISOString(),
  roundsCompleted: roundNumbers,
  drivers: driverStandings,
  constructors: constructorStandings,
}

writeJson(STANDINGS_FILE, standings)

const summary = roundNumbers.length
  ? `round(s) ${roundNumbers.join(', ')}`
  : 'no completed rounds yet'

console.log(
  `✓ Standings written to ${STANDINGS_FILE} — ${summary}, ` +
    `${driverStandings.length} driver(s), ${constructorStandings.length} team(s).`,
)
