import calendarJson from '@data/calendar.json'
import type { CalendarRound, QualifyingResult, RaceResult, Round } from '../model'

const calendar = calendarJson as CalendarRound[]

const roundModules = import.meta.glob<Round>('../../../../data/rounds/round-*.json', {
  eager: true,
  import: 'default',
})

const rounds = Object.values(roundModules).sort((a, b) => a.round - b.round)

const byRound = new Map(rounds.map((entry) => [entry.round, entry]))

/** Returns the full season calendar from `data/calendar.json`, in round order. */
export const getCalendar = (): CalendarRound[] => calendar

/**
 * Looks up one calendar entry.
 * @param round 1-based round number.
 */
export const getCalendarRound = (round: number): CalendarRound | undefined =>
  calendar.find((entry) => entry.round === round)

/** Returns every round results file that exists on disk, in round order. */
export const getRounds = (): Round[] => rounds

/**
 * Reads one round's results file.
 * @param round 1-based round number.
 * @returns The round results, or `undefined` if no file exists for it yet.
 */
export const getRoundResults = (round: number): Round | undefined => byRound.get(round)

/**
 * Race classification for a round, empty unless the race is marked `completed`.
 * @param round 1-based round number.
 */
export const getRaceResults = (round: number): RaceResult[] => {
  const entry = byRound.get(round)

  if (!entry || entry.race.status !== 'completed') return []

  // Classified finishers in order, then retirements (position null) last.
  return [...entry.race.results].sort(
    (a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER),
  )
}

/**
 * Qualifying classification for a round, empty unless qualifying is `completed`.
 * @param round 1-based round number.
 */
export const getQualifyingResults = (round: number): QualifyingResult[] => {
  const entry = byRound.get(round)

  if (!entry || entry.qualifying.status !== 'completed') return []

  return [...entry.qualifying.results].sort((a, b) => a.position - b.position)
}

/** Round numbers whose race is marked `completed`, ascending. */
export const getCompletedRounds = (): number[] =>
  rounds.filter((entry) => entry.race.status === 'completed').map((entry) => entry.round)

/**
 * The next round that has not been raced yet, or `undefined` once the season ends.
 * Uses the calendar as the source of truth so unraced rounds without a file still count.
 */
export const getNextRound = (): CalendarRound | undefined => {
  const completed = new Set(getCompletedRounds())

  return calendar.find((entry) => !completed.has(entry.round))
}

/** The most recently completed round, or `undefined` before the season starts. */
export const getLastCompletedRound = (): CalendarRound | undefined => {
  const completed = getCompletedRounds()
  const last = completed[completed.length - 1]

  return last === undefined ? undefined : getCalendarRound(last)
}
