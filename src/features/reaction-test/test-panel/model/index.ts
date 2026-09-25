/** How many launches make up one full test. */
export const LAUNCHES = 5

/** Columns on the gantry — one comes on every `LIGHT_INTERVAL`. */
export const LIGHT_COLUMNS = 5

/** Lights on a single gantry column. */
export const LIGHTS_PER_COLUMN = 2

/** Gap between each column lighting up, in ms. */
export const LIGHT_INTERVAL = 1000

/**
 * Bounds of the random hold between the fifth light and lights-out, in ms.
 * Random so nobody can time the start by rhythm.
 */
export const HOLD_MIN = 200
export const HOLD_MAX = 3000

/** How long the jump-start penalty stays on screen before the launch resets. */
export const JUMP_RESET = 2200

/**
 * Presses this soon after a result is shown are ignored, so a double tap on
 * the reaction does not immediately start — and jump — the next launch.
 */
export const RESULT_GUARD = 400

/**
 * - `idle` — waiting for the first press of a launch
 * - `lights` — columns are coming on one by one
 * - `armed` — all five lit, holding for a random time
 * - `go` — lights out, the clock is running
 * - `result` — a launch's reaction time is on show
 * - `jump` — pressed before lights-out, launch voided
 * - `summary` — all launches done
 */
export type Phase =
  | 'idle'
  | 'lights'
  | 'armed'
  | 'go'
  | 'result'
  | 'jump'
  | 'summary'

/** A reaction time in ms, or `null` for a launch not yet run. */
export type LaunchTime = number | null

export const randomHold = (): number =>
  Math.round(HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN))

export const emptyTimes = (): LaunchTime[] => Array(LAUNCHES).fill(null)

const recorded = (times: LaunchTime[]): number[] =>
  times.filter((time): time is number => time !== null)

/** Mean of the launches run so far, rounded to the ms. */
export const averageOf = (times: LaunchTime[]): number | null => {
  const done = recorded(times)

  if (!done.length) return null

  return Math.round(done.reduce((sum, time) => sum + time, 0) / done.length)
}

/** Quickest launch run so far. */
export const bestOf = (times: LaunchTime[]): number | null => {
  const done = recorded(times)

  return done.length ? Math.min(...done) : null
}

export const launchLabel = (launch: number) => `LAUNCH ${launch + 1} / ${LAUNCHES}`

const STORAGE_KEY = 'f1uz:reaction-test:latest-average'

/** The average from the last completed test, kept between visits. */
export const loadLatestAverage = (): number | null => {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY))

    return Number.isFinite(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

export const saveLatestAverage = (value: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // Storage can be blocked (private mode, disabled site data) — the
    // average then simply lasts for this visit only.
  }
}
