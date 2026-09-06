export type RoundResult = number | 'DNF' | 'DSQ' | '—'

export interface DriverStanding {
  pos: number
  driver: string
  nationality: string
  team: string
  results: RoundResult[]
  pts: number
}

export interface ConstructorStanding {
  pos: number
  team: string
  drivers: string[]
  pts: number
}

export const defaultDriverStandings: DriverStanding[] = [
  {
    pos: 1,
    driver: 'Abdulaziz Izzatullayev',
    nationality: 'UZB',
    team: 'Mercedes',
    results: [1, 2, 2, 3, 1],
    pts: 104,
  },
  {
    pos: 2,
    driver: 'Timur',
    nationality: 'UZB',
    team: 'Ferrari',
    results: [2, 1, 3, 1, 2],
    pts: 102,
  },
  {
    pos: 3,
    driver: 'Aziz',
    nationality: 'UZB',
    team: 'Red Bull Racing',
    results: [3, 4, 1, 2, 3],
    pts: 86,
  },
  {
    pos: 4,
    driver: 'Bobur',
    nationality: 'UZB',
    team: 'McLaren',
    results: [4, 3, 4, 5, 4],
    pts: 61,
  },
  {
    pos: 5,
    driver: 'Jamshid',
    nationality: 'UZB',
    team: 'Renault',
    results: [5, 6, 6, 4, 5],
    pts: 48,
  },
  {
    pos: 6,
    driver: 'Sardor',
    nationality: 'UZB',
    team: 'Mercedes',
    results: [6, 5, 7, 7, 7],
    pts: 36,
  },
  {
    pos: 7,
    driver: 'Javlon',
    nationality: 'UZB',
    team: 'Ferrari',
    results: [7, 8, 5, 8, 6],
    pts: 32,
  },
  {
    pos: 8,
    driver: 'Otabek',
    nationality: 'UZB',
    team: 'Red Bull Racing',
    results: [9, 7, 'DNF', 6, 9],
    pts: 18,
  },
  {
    pos: 9,
    driver: 'Ulugbek',
    nationality: 'UZB',
    team: 'Racing Point',
    results: [8, 'DNF', 8, 10, 8],
    pts: 12,
  },
  {
    pos: 10,
    driver: 'Diyor',
    nationality: 'UZB',
    team: 'AlphaTauri',
    results: [10, 9, 11, 9, 10],
    pts: 5,
  },
  {
    pos: 11,
    driver: 'Farrukh',
    nationality: 'UZB',
    team: 'Racing Point',
    results: [13, 10, 12, 9, 12],
    pts: 3,
  },
  {
    pos: 12,
    driver: 'Islom',
    nationality: 'UZB',
    team: 'AlphaTauri',
    results: [12, 13, 9, 13, 13],
    pts: 2,
  },
  {
    pos: 13,
    driver: 'Rustam',
    nationality: 'UZB',
    team: 'Haas',
    results: ['DNF', 11, 10, 11, 'DSQ'],
    pts: 1,
  },
  {
    pos: 14,
    driver: 'Bekzod',
    nationality: 'UZB',
    team: 'McLaren',
    results: [14, 14, 13, 14, 14],
    pts: 0,
  },
  {
    pos: 15,
    driver: 'Shahzod',
    nationality: 'UZB',
    team: 'Renault',
    results: [15, 15, 14, 15, 15],
    pts: 0,
  },
  {
    pos: 16,
    driver: 'Anvar',
    nationality: 'UZB',
    team: 'Haas',
    results: [16, 16, 15, 16, 11],
    pts: 0,
  },
  {
    pos: 17,
    driver: 'Davron',
    nationality: 'UZB',
    team: 'Alfa Romeo',
    results: [11, 17, 16, 17, 16],
    pts: 0,
  },
  {
    pos: 18,
    driver: 'Sanjar',
    nationality: 'UZB',
    team: 'Alfa Romeo',
    results: [17, 12, 17, 'DNF', 17],
    pts: 0,
  },
  {
    pos: 19,
    driver: 'Nodir',
    nationality: 'UZB',
    team: 'Williams',
    results: [18, 18, 'DNF', 12, 18],
    pts: 0,
  },
  {
    pos: 20,
    driver: 'Elyor',
    nationality: 'UZB',
    team: 'Williams',
    results: ['DNF', 19, 18, 18, 'DNF'],
    pts: 0,
  },
]

export const roundCount = (rows: DriverStanding[]) =>
  rows.reduce((max, row) => Math.max(max, row.results.length), 0)

export const isRetired = (value: RoundResult) =>
  value === 'DNF' || value === 'DSQ'

export const buildConstructorStandings = (
  rows: DriverStanding[],
): ConstructorStanding[] => {
  const teams = new Map<string, { drivers: string[]; pts: number }>()

  rows.forEach((row) => {
    const entry = teams.get(row.team) ?? { drivers: [], pts: 0 }

    entry.drivers.push(row.driver)
    entry.pts += row.pts
    teams.set(row.team, entry)
  })

  return [...teams.entries()]
    .map(([team, entry]) => ({ team, ...entry }))
    .sort((a, b) => b.pts - a.pts)
    .map((entry, index) => ({ pos: index + 1, ...entry }))
}
