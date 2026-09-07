export type ChampionshipStatus = 'active' | 'completed' | 'upcoming'

export type FastestLapEligibility = 'top10' | 'any'

/** Points awarded per finishing position, keyed by position as a string ('1', '2', …). */
export type ScoringTable = Record<string, number>

export interface BonusPoints {
  fastestLap: number
  fastestLapEligibility: FastestLapEligibility
}

export interface Championship {
  id: string
  name: string
  season: number
  game: string
  category: string
  platform: string
  region: string
  status: ChampionshipStatus
  scoring: ScoringTable
  bonusPoints: BonusPoints
  driverCount: number
  roundsTotal: number
}
