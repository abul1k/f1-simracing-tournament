export interface StandingRow {
  pos: number
  driver: string
  team: string
  pts: number
  flag: string
  country: string
}

export const previewCount = 5

export const defaultStandings: StandingRow[] = [
  { pos: 1, driver: 'Abdulaziz', team: 'Mercedes', pts: 104, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 2, driver: 'Timur', team: 'Ferrari', pts: 102, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 3, driver: 'Aziz', team: 'Red Bull Racing', pts: 86, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 4, driver: 'Bobur', team: 'McLaren', pts: 61, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 5, driver: 'Jamshid', team: 'Renault', pts: 48, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 6, driver: 'Javlon', team: 'Ferrari', pts: 44, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 7, driver: 'Sardor', team: 'Mercedes', pts: 39, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 8, driver: 'Ulugbek', team: 'Racing Point', pts: 33, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 9, driver: 'Otabek', team: 'Red Bull Racing', pts: 28, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 10, driver: 'Diyor', team: 'AlphaTauri', pts: 24, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 11, driver: 'Farrukh', team: 'Racing Point', pts: 20, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 12, driver: 'Islom', team: 'AlphaTauri', pts: 17, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 13, driver: 'Bekzod', team: 'McLaren', pts: 13, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 14, driver: 'Shahzod', team: 'Renault', pts: 10, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 15, driver: 'Anvar', team: 'Haas', pts: 8, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 16, driver: 'Davron', team: 'Alfa Romeo', pts: 6, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 17, driver: 'Sanjar', team: 'Alfa Romeo', pts: 4, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 18, driver: 'Nodir', team: 'Williams', pts: 3, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 19, driver: 'Elyor', team: 'Williams', pts: 1, flag: '🇺🇿', country: 'Uzbekistan' },
  { pos: 20, driver: 'Rustam', team: 'Haas', pts: 0, flag: '🇺🇿', country: 'Uzbekistan' },
]

export const ordinals: Record<number, string> = {
  1: 'ST',
  2: 'ND',
  3: 'RD',
}

export const podiumHeights: Record<number, string> = {
  1: '240px',
  2: '220px',
  3: '200px',
}

export const splitName = (name: string) => {
  const [first, ...rest] = name.split(' ')

  return rest.length
    ? { first, last: rest.join(' ') }
    : { first: '', last: first }
}

export const trendColor = (trend: string) => {
  if (trend.startsWith('↑')) return 'text-[#3FA35C]'
  if (trend.startsWith('↓')) return 'text-[#C13B33]'

  return 'text-[#68686D]'
}
