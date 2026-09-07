/** Shared filesystem helpers for the `data/` directory, used by every script. */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const DATA_DIR = path.join(ROOT, 'data')
export const ROUNDS_DIR = path.join(DATA_DIR, 'rounds')

export const CHAMPIONSHIP_FILE = 'data/championship.json'
export const TEAMS_FILE = 'data/teams.json'
export const DRIVERS_FILE = 'data/drivers.json'
export const CALENDAR_FILE = 'data/calendar.json'
export const STANDINGS_FILE = 'data/standings.json'

/**
 * Reads and parses a JSON file.
 * @param relativePath Path from the repo root, e.g. `data/teams.json`.
 * @returns The parsed contents, typed as `T` — call only on validated files.
 * @throws If the file is missing or is not valid JSON, with the file name in the message.
 */
export const readJson = <T>(relativePath: string): T => {
  const absolute = path.join(ROOT, relativePath)

  let raw: string

  try {
    raw = fs.readFileSync(absolute, 'utf8')
  } catch {
    throw new Error(`${relativePath} — file not found`)
  }

  try {
    return JSON.parse(raw) as T
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)

    throw new Error(`${relativePath} — invalid JSON: ${detail}`)
  }
}

/**
 * Writes a value as formatted JSON, matching the 2-space style admins edit by hand.
 * @param relativePath Path from the repo root, e.g. `data/standings.json`.
 * @param value Any JSON-serialisable value.
 */
export const writeJson = (relativePath: string, value: unknown): void => {
  const absolute = path.join(ROOT, relativePath)

  fs.mkdirSync(path.dirname(absolute), { recursive: true })
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

/**
 * Lists every round results file, sorted by round number.
 * @returns Repo-root-relative paths such as `data/rounds/round-01.json`.
 */
export const listRoundFiles = (): string[] => {
  if (!fs.existsSync(ROUNDS_DIR)) return []

  return fs
    .readdirSync(ROUNDS_DIR)
    .filter((name) => /^round-\d+\.json$/.test(name))
    .sort()
    .map((name) => `data/rounds/${name}`)
}

/**
 * Builds the canonical file path for a round.
 * @param round 1-based round number.
 * @returns A path such as `data/rounds/round-07.json`.
 */
export const roundFilePath = (round: number): string =>
  `data/rounds/round-${String(round).padStart(2, '0')}.json`
