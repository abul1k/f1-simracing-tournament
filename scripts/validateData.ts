/**
 * Validates every file under `data/` and exits non-zero if anything is wrong.
 *
 * Run by CI before the site builds, so a bad hand-edit fails the pipeline with a
 * readable message instead of shipping a broken page.
 *
 * Checks performed:
 *   1. Structure  — required fields, value types, enum values, string formats.
 *   2. Uniqueness — duplicate ids, duplicate rounds, duplicate finishing positions.
 *   3. References — every `teamId`, `driverId` and `racedFor` points at a record
 *      that exists, and a reserve driver who raced says who they raced for.
 *
 * Anything reported as a warning is published anyway — it is a likely mistake,
 * not a broken file, so it must not block a race result going live.
 *
 * Usage: `node scripts/validateData.ts`
 */

import type { Driver } from '../src/entities/driver/model/index.ts'
import type { Round } from '../src/entities/round/model/index.ts'
import type { Team } from '../src/entities/team/model/index.ts'
import type { CalendarRound } from '../src/entities/round/model/index.ts'
import {
  CALENDAR_FILE,
  CHAMPIONSHIP_FILE,
  DRIVERS_FILE,
  TEAMS_FILE,
  listRoundFiles,
  readJson,
} from './lib/dataFiles.ts'
import { formatIssues, validate, type Issue } from './lib/schema.ts'
import { teamForRound } from '../src/entities/round/lib/index.ts'
import {
  calendarSchema,
  championshipSchema,
  driversSchema,
  roundSchema,
  teamsSchema,
} from '../schemas/index.ts'

const issues: Issue[] = []
const warnings: Issue[] = []

const add = (file: string, path: string, message: string): void => {
  issues.push({ file, path, message })
}

const warn = (file: string, path: string, message: string): void => {
  warnings.push({ file, path, message })
}

/** How many cars one team may field in a single round. */
const CARS_PER_TEAM = 2

/** Reports any value appearing more than once in `values`. */
const findDuplicates = <T>(values: T[]): T[] => {
  const seen = new Set<T>()
  const duplicates = new Set<T>()

  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  })

  return [...duplicates]
}

/**
 * Reads and structurally validates one data file.
 * @returns The parsed value, or `undefined` if the file could not be read at all.
 */
const load = <T>(file: string, schema: Parameters<typeof validate>[1]): T | undefined => {
  let parsed: T

  try {
    parsed = readJson<T>(file)
  } catch (error) {
    add(file, '(file)', error instanceof Error ? error.message : String(error))

    return undefined
  }

  validate(parsed, schema, '', file, issues)

  return parsed
}

const championship = load<{ roundsTotal: number }>(CHAMPIONSHIP_FILE, championshipSchema)
const teams = load<Team[]>(TEAMS_FILE, teamsSchema)
const drivers = load<Driver[]>(DRIVERS_FILE, driversSchema)
const calendar = load<CalendarRound[]>(CALENDAR_FILE, calendarSchema)

const driverById = new Map((drivers ?? []).map((driver) => [driver.id, driver]))
const teamIds = new Set((teams ?? []).map((team) => team.id))
const driverIds = new Set((drivers ?? []).map((driver) => driver.id))
const calendarRounds = new Set((calendar ?? []).map((entry) => entry.round))

if (teams) {
  findDuplicates(teams.map((team) => team.id)).forEach((id) => {
    add(TEAMS_FILE, 'id', `duplicate team id "${id}" — every team id must be unique`)
  })
}

if (drivers) {
  findDuplicates(drivers.map((driver) => driver.id)).forEach((id) => {
    add(DRIVERS_FILE, 'id', `duplicate driver id "${id}" — every driver id must be unique`)
  })
  findDuplicates(drivers.map((driver) => driver.number)).forEach((number) => {
    add(DRIVERS_FILE, 'number', `duplicate car number ${number} — two drivers cannot share one`)
  })
  drivers.forEach((driver, index) => {
    // `null` is a reserve driver — no permanent seat, so nothing to resolve.
    if (teams && driver.teamId !== null && !teamIds.has(driver.teamId)) {
      add(
        DRIVERS_FILE,
        `[${index}].teamId`,
        `"${driver.teamId}" is not a team in ${TEAMS_FILE} (driver "${driver.name}")`,
      )
    }
  })
}

if (calendar) {
  findDuplicates(calendar.map((entry) => entry.round)).forEach((round) => {
    add(CALENDAR_FILE, 'round', `duplicate round ${round} — every round number must be unique`)
  })

  if (championship && calendar.length !== championship.roundsTotal) {
    add(
      CALENDAR_FILE,
      '(root)',
      `has ${calendar.length} round(s) but ${CHAMPIONSHIP_FILE} declares roundsTotal: ${championship.roundsTotal}`,
    )
  }
}

listRoundFiles().forEach((file) => {
  const round = load<Round>(file, roundSchema)

  if (!round) return

  if (calendar && !calendarRounds.has(round.round)) {
    add(file, 'round', `round ${round.round} is not listed in ${CALENDAR_FILE}`)
  }

  const sessions = [
    { name: 'qualifying', results: round.qualifying?.results ?? [] },
    { name: 'race', results: round.race?.results ?? [] },
  ]

  sessions.forEach((session) => {
    findDuplicates(session.results.map((result) => result.driverId)).forEach((id) => {
      add(file, `${session.name}.results`, `driver "${id}" appears more than once`)
    })
    // Retirements share `position: null`, so only classified results are compared.
    const classified = session.results
      .map((result) => result.position)
      .filter((position): position is number => typeof position === 'number')

    findDuplicates(classified).forEach((position) => {
      add(file, `${session.name}.results`, `position ${position} is assigned to more than one driver`)
    })
    session.results.forEach((result, index) => {
      if (drivers && !driverIds.has(result.driverId)) {
        add(
          file,
          `${session.name}.results[${index}].driverId`,
          `"${result.driverId}" is not a driver in ${DRIVERS_FILE}`,
        )
      }
    })
  })

  // `racedFor` names the team a drive counts for. A driver takes one team per
  // round, so the two sessions may not disagree about which.
  const racedFor = new Map<string, { team: string; where: string }>()

  sessions.forEach((session) => {
    session.results.forEach((result, index) => {
      const declared = result.racedFor

      if (!declared) return

      const where = `${session.name}.results[${index}].racedFor`

      if (teams && !teamIds.has(declared)) {
        add(file, where, `"${declared}" is not a team in ${TEAMS_FILE}`)

        return
      }

      const already = racedFor.get(result.driverId)

      if (already && already.team !== declared) {
        add(
          file,
          where,
          `driver "${result.driverId}" is down as racing for "${already.team}" at ` +
            `${already.where} and "${declared}" here — a driver takes one team per round`,
        )

        return
      }

      racedFor.set(result.driverId, { team: declared, where })
    })
  })

  // A reserve driver has no team of their own, so a drive of theirs reaches the
  // constructors' table only through `racedFor`. Report the first session that
  // needed it, once per driver rather than once per session.
  const missingRacedFor = new Map<string, string>()

  sessions.forEach((session) => {
    session.results.forEach((result, index) => {
      const driver = driverById.get(result.driverId)

      if (!driver || driver.teamId !== null) return
      if (result.status === 'dns' || racedFor.has(result.driverId)) return
      if (missingRacedFor.has(result.driverId)) return

      missingRacedFor.set(result.driverId, `${session.name}.results[${index}].racedFor`)
    })
  })

  missingRacedFor.forEach((where, driverId) => {
    add(
      file,
      where,
      `"${driverById.get(driverId)?.name ?? driverId}" is a reserve driver with no team ` +
        `of their own — add "racedFor": "TEAM_..." to say who they stood in for, ` +
        `or their points reach no constructor`,
    )
  })

  // Two cars per team per round. A stand-in replaces a driver rather than
  // joining them, so a third car usually means the driver they replaced was
  // left in the file by mistake. Warned, not failed: the result is still real.
  const carsPerTeam = new Map<string, string[]>()

  round.race?.results?.forEach((result) => {
    if (result.status === 'dns') return

    const team = teamForRound(round, driverById.get(result.driverId))

    if (team === null) return

    carsPerTeam.set(team, [...(carsPerTeam.get(team) ?? []), result.driverId])
  })

  carsPerTeam.forEach((entrants, team) => {
    if (entrants.length <= CARS_PER_TEAM) return

    warn(
      file,
      'race.results',
      `${entrants.length} cars are counted for "${team}" (${entrants.join(', ')}) — a team ` +
        `fields ${CARS_PER_TEAM}. Mark the driver who was replaced as "dns", or drop them ` +
        `from the file.`,
    )
  })

  round.qualifying?.results?.forEach((result, index) => {
    const path = `qualifying.results[${index}]`

    // An entry with no lap time must say why it has none.
    if (!result.time && !result.status) {
      add(
        file,
        `${path}.time`,
        `driver "${result.driverId}" has no lap time — enter one, or add ` +
          `"status": "dnf", "dsq" or "dns"`,
      )
    }

    if (result.status === 'dns') {
      if (result.position !== null) {
        add(
          file,
          `${path}.position`,
          `driver "${result.driverId}" did not start qualifying, so position must be null`,
        )
      }
    } else if (typeof result.position !== 'number') {
      add(
        file,
        `${path}.position`,
        `driver "${result.driverId}" took part in qualifying, so it needs a position, not null`,
      )
    }
  })

  round.race?.results?.forEach((result, index) => {
    // A driver recorded as finishing must have a finishing position. A
    // retirement may carry one too — a `dnf` or `dsq` is still classified in
    // the order it dropped out — so only `null` and a real position are wrong
    // in the one case each: a finisher without one, a non-starter with one.
    if (result.status === 'finished' && typeof result.position !== 'number') {
      add(
        file,
        `race.results[${index}].position`,
        `driver "${result.driverId}" is marked "finished" so it needs a finishing position, not null`,
      )
    }
    if (result.status === 'dns' && result.position !== null) {
      add(
        file,
        `race.results[${index}].position`,
        `driver "${result.driverId}" did not start, so position must be null`,
      )
    }
  })
})

if (warnings.length > 0) {
  console.warn(`\n⚠ ${warnings.length} thing(s) worth a second look:\n`)
  console.warn(formatIssues(warnings))
  console.warn('\nThese do not block the build — fix them if they are mistakes.\n')
}

if (issues.length > 0) {
  console.error(`\n✗ Data validation failed — ${issues.length} problem(s):\n`)
  console.error(formatIssues(issues))
  console.error('\nFix the fields listed above and commit again.\n')
  process.exit(1)
}

console.log('✓ Data validation passed — all files under data/ are valid.')
