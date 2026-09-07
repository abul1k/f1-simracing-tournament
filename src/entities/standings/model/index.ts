import type { RoundOutcome } from '@/entities/round/model'

export interface DriverStandingEntry {
  position: number
  driverId: string
  points: number
  wins: number
  podiums: number
  /** Finishing outcome per completed round, in round order. */
  results: RoundOutcome[]
}

export interface ConstructorStandingEntry {
  position: number
  teamId: string
  points: number
  wins: number
  podiums: number
}

/** The generated `data/standings.json` — the only standings source the app reads. */
export interface Standings {
  // generatedAt: string
  roundsCompleted: number[]
  drivers: DriverStandingEntry[]
  constructors: ConstructorStandingEntry[]
}
