export interface ProfileSource {
  pos: number
  driver: string
  nationality: string
  team: string
  results: (number | string)[]
  pts: number
}

export interface ProfileRound {
  round: number
  country: string
}

export interface HistoryEntry {
  round: number
  label: string
  circuit: string
  qualifying: number | null
  finish: number | string
  points: number
  cumulative: number
}

export interface ProfileStats {
  races: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  dnfs: number
  averageFinish: string
}

export const pointsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

export const racePoints = (finish: number | string, fastestLap: boolean) => {
  if (typeof finish !== 'number') return 0

  const base = pointsTable[finish - 1] ?? 0

  return base + (fastestLap && finish <= 10 ? 1 : 0)
}

export const qualifyingByDriver: Record<string, number[]> = {
  Abdulaziz: [1, 2, 2, 2, 1],
}

export const fastestLapsByDriver: Record<string, number[]> = {
  Abdulaziz: [1, 3, 5],
}

const firstName = (name: string) => name.split(' ')[0]

export const buildHistory = (
  source: ProfileSource,
  rounds: ProfileRound[],
  circuitOf: (country: string) => string,
): HistoryEntry[] => {
  const key = firstName(source.driver)
  const quali = qualifyingByDriver[key] ?? []
  const fastest = fastestLapsByDriver[key] ?? []

  let running = 0

  return source.results.map((finish, index) => {
    const round = index + 1
    const points = racePoints(finish, fastest.includes(round))

    running += points

    return {
      round,
      label: `R${round}`,
      circuit: circuitOf(rounds[index]?.country ?? ''),
      qualifying: quali[index] ?? null,
      finish,
      points,
      cumulative: running,
    }
  })
}

export const buildStats = (
  source: ProfileSource,
  history: HistoryEntry[],
): ProfileStats => {
  const finishes = source.results.filter(
    (result): result is number => typeof result === 'number',
  )

  return {
    races: source.results.length,
    wins: finishes.filter((finish) => finish === 1).length,
    podiums: finishes.filter((finish) => finish <= 3).length,
    poles: history.filter((entry) => entry.qualifying === 1).length,
    fastestLaps: (fastestLapsByDriver[firstName(source.driver)] ?? []).length,
    dnfs: source.results.filter((result) => typeof result !== 'number').length,
    averageFinish: finishes.length
      ? (finishes.reduce((sum, finish) => sum + finish, 0) / finishes.length).toFixed(1)
      : '—',
  }
}

export const positionHeight = (position: number | string | null) => {
  if (typeof position !== 'number') return 6

  return Math.max(6, ((11 - Math.min(position, 10)) / 10) * 140)
}

export const valueHeight = (value: number, max: number) =>
  max > 0 ? Math.max(6, (value / max) * 140) : 6
