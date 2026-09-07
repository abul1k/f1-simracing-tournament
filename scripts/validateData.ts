/**
 * Validates every file under `data/` and exits non-zero if anything is wrong.
 *
 * Run by CI before the site builds, so a bad hand-edit fails the pipeline with a
 * readable message instead of shipping a broken page.
 *
 * Checks performed:
 *   1. Structure  — required fields, value types, enum values, string formats.
 *   2. Uniqueness — duplicate ids, duplicate rounds, duplicate finishing positions.
 *   3. References — every `teamId` and `driverId` points at a record that exists.
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
import {
  calendarSchema,
  championshipSchema,
  driversSchema,
  roundSchema,
  teamsSchema,
} from '../schemas/index.ts'

const issues: Issue[] = []

const add = (file: string, path: string, message: string): void => {
  issues.push({ file, path, message })
}

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
    if (teams && !teamIds.has(driver.teamId)) {
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

  // A driver recorded as finishing must have a finishing position.
  round.race?.results?.forEach((result, index) => {
    if (result.status === 'finished' && typeof result.position !== 'number') {
      add(
        file,
        `race.results[${index}].position`,
        `driver "${result.driverId}" is marked "finished" so it needs a finishing position, not null`,
      )
    }
  })
})

if (issues.length > 0) {
  console.error(`\n✗ Data validation failed — ${issues.length} problem(s):\n`)
  console.error(formatIssues(issues))
  console.error('\nFix the fields listed above and commit again.\n')
  process.exit(1)
}

console.log('✓ Data validation passed — all files under data/ are valid.')
