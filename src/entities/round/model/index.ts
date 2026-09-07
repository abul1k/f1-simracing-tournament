export type RaceType = 'FEATURE RACE' | 'SPRINT RACE'

export type SessionStatus = 'pending' | 'completed'

export type RaceResultStatus = 'finished' | 'dnf' | 'dsq' | 'dns'

/** Marks a qualifying entry that set no lap time. Absent means a clean timed lap. */
export type QualifyingResultStatus = 'dnf' | 'dsq'

/** One scheduled round, as listed in `data/calendar.json`. */
export interface CalendarRound {
  round: number
  flag: string
  country: string
  type: RaceType
  date: string
}

export interface QualifyingResult {
  driverId: string
  position: number
  /** `M:SS.mmm`, or empty for a driver who set no time — see `status`. */
  time: string
  /** Omitted for a driver who set a time; `dnf`/`dsq` leaves `time` empty. */
  status?: QualifyingResultStatus
}

/** True when a qualifying entry has no lap time to show. */
export const hasNoLapTime = (result: QualifyingResult): boolean => !result.time

export interface RaceResult {
  driverId: string
  /** null for a retirement — a `dnf`/`dsq`/`dns` has no classified finishing position. */
  position: number | null
  /** null when the driver took no grid slot, e.g. a `dns`. */
  gridPosition: number | null
  status: RaceResultStatus
  fastestLap: boolean
  points: number
}

export interface RoundQualifying {
  status: SessionStatus
  results: QualifyingResult[]
}

export interface RoundRace {
  status: SessionStatus
  results: RaceResult[]
}

/** One round's results file, as stored in `data/rounds/round-NN.json`. */
export interface Round {
  round: number
  qualifying: RoundQualifying
  race: RoundRace
}

/** A finishing position, or a retirement marker, or `—` for a round not yet run. */
export type RoundOutcome = number | 'DNF' | 'DSQ' | 'DNS' | '—'

export const isRetired = (value: RoundOutcome): value is 'DNF' | 'DSQ' | 'DNS' =>
  value === 'DNF' || value === 'DSQ' || value === 'DNS'

/** A classified finisher — guaranteed to carry a finishing position. */
export type ClassifiedResult = RaceResult & { position: number }

/** Narrows a result to a classified finisher, excluding retirements. */
export const isClassified = (result: RaceResult): result is ClassifiedResult =>
  result.status === 'finished' && result.position !== null

/** Narrows a result to a top-three finish. */
export const isPodiumFinish = (result: RaceResult): result is ClassifiedResult =>
  isClassified(result) && result.position <= 3

/** Maps a race result to the marker shown in a results grid. */
export const outcomeOf = (result: RaceResult): RoundOutcome => {
  if (result.status === 'dnf') return 'DNF'
  if (result.status === 'dsq') return 'DSQ'
  if (result.status === 'dns') return 'DNS'

  return result.position ?? '—'
}
