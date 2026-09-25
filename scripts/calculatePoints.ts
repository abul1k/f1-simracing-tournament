/**
 * Recomputes the `points` field on every race result and writes it back to disk.
 *
 * Computed points are the source of truth: whatever an admin typed into `points`
 * is overwritten. Admins are responsible for `position`, `status` and
 * `fastestLap` only.
 *
 * Rules, all read from `data/championship.json`:
 *   - `finished` → points for that position from the round's scoring table (0
 *     outside it): `sprintScoring` for a round `data/calendar.json` marks as a
 *     `SPRINT RACE`, `scoring` for a feature race.
 *   - `dnf` / `dsq` → always 0, whatever the position says.
 *   - fastest lap → adds `bonusPoints.fastestLap`, but only for a finisher who is
 *     eligible under `bonusPoints.fastestLapEligibility` (`top10` or `any`).
 *     A sprint pays no bonus at all — its points come from position alone.
 *
 * Usage: `node scripts/calculatePoints.ts [round]`
 *   With no argument every round file is processed; pass a round number for one.
 */

import type { Championship } from '../src/entities/championship/model/index.ts'
import type {
  CalendarRound,
  RaceResult,
  RaceType,
  Round,
} from '../src/entities/round/model/index.ts'
import {
  CALENDAR_FILE,
  CHAMPIONSHIP_FILE,
  listRoundFiles,
  readJson,
  roundFilePath,
  writeJson,
} from './lib/dataFiles.ts'

const championship = readJson<Championship>(CHAMPIONSHIP_FILE)
const calendar = readJson<CalendarRound[]>(CALENDAR_FILE)

/**
 * The race type of a round, as the calendar declares it.
 * @param round 1-based round number.
 * @returns The round's type, defaulting to a feature race for a round the
 *   calendar does not list — validateData rejects that case before a build.
 */
const raceTypeOf = (round: number): RaceType =>
  calendar.find((entry) => entry.round === round)?.type ?? 'FEATURE RACE'

/**
 * Points earned by a single race result.
 *
 * Mirrors `pointsForPosition` and `isFastestLapEligible` in
 * `@/entities/championship/api`, which the site uses to show the same numbers.
 *
 * @param result One entry from a round's `race.results` array.
 * @param type The round's race type — sprints score on the shorter table.
 * @returns Position points plus any fastest-lap bonus; 0 for a DNF or DSQ.
 */
export const pointsForResult = (result: RaceResult, type: RaceType): number => {
  if (result.status !== 'finished' || result.position === null) return 0

  const sprint = type === 'SPRINT RACE'
  const table = sprint ? championship.sprintScoring : championship.scoring
  const base = table[String(result.position)] ?? 0

  // A sprint pays for position only, so no finisher there collects the bonus.
  const eligible =
    !sprint &&
    (championship.bonusPoints.fastestLapEligibility === 'any' || result.position <= 10)

  const bonus = result.fastestLap && eligible ? championship.bonusPoints.fastestLap : 0

  return base + bonus
}

/**
 * Rewrites one round file with freshly computed points.
 * @param file Repo-root-relative path, e.g. `data/rounds/round-01.json`.
 * @returns How many results had their points changed.
 */
const processRound = (file: string): number => {
  const round = readJson<Round>(file)
  const type = raceTypeOf(round.round)

  let changed = 0

  const results = round.race.results.map((result) => {
    const normalized: RaceResult = { ...result, fastestLap: result.fastestLap ?? false }
    const points = pointsForResult(normalized, type)

    if (result.points !== points) changed += 1

    return { ...normalized, points }
  })

  writeJson(file, { ...round, race: { ...round.race, results } })

  const label = round.race.status === 'completed' ? 'completed' : 'pending'

  console.log(
    `  ${file} — ${results.length} result(s), ${changed} updated ` +
      `(${type.toLowerCase()}, race ${label})`,
  )

  return changed
}

const [roundArg] = process.argv.slice(2)

const files = roundArg ? [roundFilePath(Number(roundArg))] : listRoundFiles()

if (files.length === 0) {
  console.log('No round files found under data/rounds — nothing to calculate.')
  process.exit(0)
}

console.log(`Calculating points using the ${championship.name} scoring table:`)

const totalChanged = files.reduce((sum, file) => sum + processRound(file), 0)

console.log(`✓ Points calculated — ${totalChanged} result(s) updated across ${files.length} file(s).`)
