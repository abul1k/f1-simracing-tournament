/**
 * Aggregates completed rounds into `data/standings.json`.
 *
 * This is the only standings source the site reads — the frontend never sums
 * round files in the browser. Rounds whose `race.status` is not `completed`
 * are skipped entirely, so a half-entered round never leaks onto the site.
 *
 * Drivers' points follow the driver. Constructors' points follow the car: a
 * result counts for the team named by `racedFor`, so a reserve standing in for
 * a team banks the points for that team while keeping them for themselves.
 * Absent contracted drivers are counted as a `dns` — see `raceEntries`.
 *
 * Tie-break (both tables): most wins, then most 2nd places, then 3rds, and so
 * on until the tie breaks — the standard countback rule. Drivers still level
 * are ordered by car number; teams by their order in `data/teams.json`.
 *
 * Usage: `node scripts/buildStandings.ts`
 */

import type { Driver } from '../src/entities/driver/model/index.ts'
import { outcomeOf } from '../src/entities/round/model/index.ts'
import { raceEntries, teamForRound } from '../src/entities/round/lib/index.ts'
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

/**
 * Counts finishing positions, indexed by position (`counts[1]` = wins).
 * Only classified finishes count; a DNF, DSQ or DNS contributes nothing.
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

/** Every completed round's classification, absent entrants filled in as `dns`. */
const classifications = new Map<number, RaceResult[]>(
  completedRounds.map((round) => [round.round, raceEntries(round, drivers)]),
)

completedRounds.forEach((round) => {
  const byDriver = new Map(
    (classifications.get(round.round) ?? []).map((result) => [result.driverId, result]),
  )

  drivers.forEach((driver) => {
    const tally = tallies.get(driver.id)

    if (!tally) return

    const result = byDriver.get(driver.id)

    // No entry at all means the driver was not an entrant — a reserve who was
    // not called up. An absent contracted driver is a `dns`, not a blank.
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

const driverById = new Map(drivers.map((driver) => [driver.id, driver]))

interface TeamTally {
  points: number
  results: RaceResult[]
  /** Everyone who drove the car, contracted or standing in. */
  drove: Set<string>
}

const teamTallies = new Map<string, TeamTally>(
  teams.map((team) => [team.id, { points: 0, results: [], drove: new Set<string>() }]),
)

// Contracted drivers belong to their team's line-up whether they raced or not.
drivers.forEach((driver) => {
  if (driver.teamId === null) return

  teamTallies.get(driver.teamId)?.drove.add(driver.id)
})

/**
 * A car's result counts for the team it was entered by. That is the driver's
 * own team unless the round recorded a `racedFor`, which is how a reserve
 * called up to stand in banks the points for the team they drove for.
 */
completedRounds.forEach((round) => {
  ;(classifications.get(round.round) ?? []).forEach((result) => {
    const teamId = teamForRound(round, driverById.get(result.driverId))

    if (teamId === null) return

    const tally = teamTallies.get(teamId)

    if (!tally) return

    tally.points += result.points ?? 0
    tally.results.push(result)
    // A stand-in only joins the line-up once they have actually driven.
    if (result.status !== 'dns') tally.drove.add(result.driverId)
  })
})

const constructorStandings: ConstructorStandingEntry[] = teams
  .map((team) => {
    const tally = teamTallies.get(team.id) ?? {
      points: 0,
      results: [] as RaceResult[],
      drove: new Set<string>(),
    }

    return {
      position: 0,
      teamId: team.id,
      points: tally.points,
      wins: winsOf(tally.results),
      podiums: podiumsOf(tally.results),
      driverIds: drivers
        .filter((driver) => tally.drove.has(driver.id))
        .map((driver) => driver.id),
      countback: countbackOf(tally.results),
    }
  })
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points

    const countback = compareCountback(a.countback, b.countback)

    if (countback !== 0) return countback

    return (teamOrder.get(a.teamId) ?? 0) - (teamOrder.get(b.teamId) ?? 0)
  })
  .map(({ countback: _countback, ...entry }, index) => ({ ...entry, position: index + 1 }))

const computed = {
  roundsCompleted: roundNumbers,
  drivers: driverStandings,
  constructors: constructorStandings,
}

/**
 * Reuse the previous timestamp when nothing else changed, so re-running on
 * unchanged data rewrites a byte-identical file. A fresh `new Date()` on every
 * run made `data/standings.json` differ from its committed copy every single
 * time, which turned each CI run into a new commit and left the file
 * conflicting on line 2 whenever two runs met in a pull.
 */
// const stampedAt = (): string => {
//   try {
//     const { generatedAt, ...previous } = readJson<Standings>(STANDINGS_FILE)

//     if (generatedAt && JSON.stringify(previous) === JSON.stringify(computed)) {
//       return generatedAt
//     }
//   } catch {
//     // No readable previous standings — fall through and stamp a fresh time.
//   }

//   return new Date().toISOString()
// }

// const standings: Standings = { generatedAt: stampedAt(), ...computed }
const standings: Standings = { ...computed }

writeJson(STANDINGS_FILE, standings)

const summary = roundNumbers.length
  ? `round(s) ${roundNumbers.join(', ')}`
  : 'no completed rounds yet'

console.log(
  `✓ Standings written to ${STANDINGS_FILE} — ${summary}, ` +
    `${driverStandings.length} driver(s), ${constructorStandings.length} team(s).`,
)
