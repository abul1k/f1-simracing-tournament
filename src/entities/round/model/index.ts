export type RaceType = 'FEATURE RACE' | 'SPRINT RACE'

export type SessionStatus = 'pending' | 'completed'

export type RaceResultStatus = 'finished' | 'dnf' | 'dsq' | 'dns'

/**
 * Marks a qualifying entry that set no lap time. Absent means a clean timed lap.
 * `dns` is never typed by an admin — it is filled in for a contracted driver
 * left out of the round file entirely. See `@/entities/round/lib`.
 */
export type QualifyingResultStatus = 'dnf' | 'dsq' | 'dns'

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
  /** null for a driver who took no part in the session at all — a `dns`. */
  position: number | null
  /** `M:SS.mmm`, or empty for a driver who set no time — see `status`. */
  time: string
  /** Omitted for a driver who set a time; `dnf`/`dsq`/`dns` leaves `time` empty. */
  status?: QualifyingResultStatus
  /** Team this drive counts for; omitted when it is the driver's own team. */
  racedFor?: string
}

/** True when a qualifying entry has no lap time to show. */
export const hasNoLapTime = (result: QualifyingResult): boolean => !result.time

export interface RaceResult {
  driverId: string
  /**
   * Where the driver is classified. A retirement can still be classified — a
   * `dnf` or `dsq` keeps the place it dropped out in — so this is only `null`
   * for a driver left out of the classification, always including a `dns`.
   * Points and podiums read `status`, never this, so a classified retirement
   * scores nothing.
   */
  position: number | null
  /** null when the driver took no grid slot, e.g. a `dns`. */
  gridPosition: number | null
  status: RaceResultStatus
  fastestLap: boolean
  points: number
  /**
   * The team this drive counts for in the constructors' table. Omitted when it
   * is the driver's own team; required for a reserve driver standing in.
   */
  racedFor?: string
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
