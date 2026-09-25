import type { CalendarRound } from '@/entities/round/model'

export type RaceRound = Pick<
  CalendarRound,
  'round' | 'country' | 'type' | 'date' | 'raceHighlights'
>

export interface RaceSession {
  key: string
  name: string
  start: string
  end?: string
}

const featureSessions: RaceSession[] = [
  { key: 'practice-1', name: 'PRACTICE 1', start: '18:30', end: '19:00' },
  { key: 'qualifying', name: 'QUALIFYING', start: '22:00', end: '22:20' },
  { key: 'race', name: 'RACE', start: '22:30' },
]

/**
 * A sprint weekend is the sprint and nothing after it — there is no separate
 * qualifying or feature race, so the sprint itself is the weekend's main race.
 */
const sprintSessions: RaceSession[] = [
  { key: 'practice-1', name: 'PRACTICE 1', start: '18:00', end: '18:30' },
  {
    key: 'sprint-qualifying',
    name: 'SPRINT QUALIFYING',
    start: '18:30',
    end: '18:50',
  },
  { key: 'sprint', name: 'SPRINT', start: '19:00', end: '19:20' },
]

export const getSessions = (round?: RaceRound) => {
  if (!round) return []

  return round.type === 'SPRINT RACE' ? sprintSessions : featureSessions
}

export const getSession = (round: RaceRound | undefined, key?: string) =>
  getSessions(round).find((session) => session.key === key)

/**
 * The first qualifying session of a weekend — sprint qualifying on a sprint
 * weekend, plain qualifying otherwise. This is the moment a race weekend goes
 * live, so it is what the home page counts down to.
 */
export const firstQualifying = (round?: RaceRound): RaceSession | undefined =>
  getSessions(round).find((session) => session.key.includes('qualifying'))

/**
 * The race that closes out the weekend — the sprint on a sprint weekend, the
 * feature race otherwise. Anything that means "the main event" (the countdown,
 * the calendar export, the highlights link) reads this rather than the `race`
 * key, which a sprint weekend does not have.
 */
export const mainRace = (round?: RaceRound): RaceSession | undefined =>
  getSessions(round).at(-1)

/**
 * Combines a round's date with a session's start time into a local datetime.
 * @returns An ISO-like local string such as `2026-09-07T22:00:00`.
 */
export const sessionStartsAt = (
  round: RaceRound,
  session: RaceSession,
): string => `${round.date}T${session.start}:00`

export const raceTitle = (round?: RaceRound) => {
  if (!round) return ''

  const year = round.date.slice(0, 4)

  return `FORMULA 1 ${round.country} GRAND PRIX ${year}`
}

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

export const dayOf = (date: string) => date.slice(8, 10)

export const monthOf = (date: string) => months[Number(date.slice(5, 7)) - 1]

export const longDate = (date: string) =>
  `${dayOf(date)} ${monthOf(date)} ${date.slice(0, 4)}`

export const sessionTime = (session: RaceSession) =>
  session.end ? `${session.start} – ${session.end}` : session.start
