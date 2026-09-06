export interface DriverSource {
  driver: string
  nationality: string
  team: string
  results: (number | string)[]
  pts: number
}

export interface DriverProfile {
  name: string
  number: number
  nationality: string
  team: string
  pts: number
  wins: number
  podiums: number
}

export const carNumbers: Record<string, number> = {
  Abdulaziz: 44,
  Sardor: 63,
  Timur: 16,
  Javlon: 55,
  Aziz: 33,
  Otabek: 10,
  Bobur: 4,
  Bekzod: 3,
  Jamshid: 27,
  Shahzod: 31,
  Ulugbek: 18,
  Farrukh: 11,
  Islom: 24,
  Anvar: 87,
  Davron: 77,
  Sanjar: 5,
  Nodir: 6,
  Elyor: 23,
  Rustam: 20,
  Diyor: 30,
}

const numberOf = (name: string) =>
  carNumbers[name] ?? carNumbers[name.split(' ')[0]] ?? 0

export const buildDrivers = (rows: DriverSource[]): DriverProfile[] =>
  rows.map((row) => ({
    name: row.driver,
    number: numberOf(row.driver),
    nationality: row.nationality,
    team: row.team,
    pts: row.pts,
    wins: row.results.filter((result) => result === 1).length,
    podiums: row.results.filter(
      (result) => typeof result === 'number' && result <= 3,
    ).length,
  }))

export type SortKey = 'POSITION' | 'POINTS' | 'WINS' | 'NUMBER'

export const sortKeys: SortKey[] = ['POSITION', 'POINTS', 'WINS', 'NUMBER']

export const sorters: Record<SortKey, (a: DriverProfile, b: DriverProfile) => number> = {
  POSITION: () => 0,
  POINTS: (a, b) => b.pts - a.pts,
  WINS: (a, b) => b.wins - a.wins,
  NUMBER: (a, b) => a.number - b.number,
}

export type StatusKey = 'ALL' | 'SCORED' | 'NO POINTS'

export const statusKeys: StatusKey[] = ['ALL', 'SCORED', 'NO POINTS']

export const matchesStatus = (driver: DriverProfile, status: StatusKey) => {
  if (status === 'SCORED') return driver.pts > 0
  if (status === 'NO POINTS') return driver.pts === 0

  return true
}
