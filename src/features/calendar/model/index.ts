export type RaceType = 'FEATURE RACE' | 'SPRINT RACE'

export interface PodiumEntry {
  code: string
  team: string
  time: string
}

export interface CalendarRound {
  round: number
  flag: string
  country: string
  type: RaceType
  date: string
  podium?: PodiumEntry[]
}

export const podiumLabels = ['1ST', '2ND', '3RD']

export const defaultRounds: CalendarRound[] = [
  {
    round: 1,
    flag: '🇦🇺',
    country: 'AUSTRALIA',
    type: 'FEATURE RACE',
    date: '2026-09-07',
  },
  {
    round: 2,
    flag: '🇧🇭',
    country: 'BAHRAIN',
    type: 'FEATURE RACE',
    date: '2026-09-10',
    podium: [
      { code: 'HAM', team: 'Mercedes', time: '1:34.567' },
      { code: 'BOT', team: 'Mercedes', time: '1:38.541' },
      { code: 'MAX', team: 'Red Bull Racing', time: '1:55.967' },
    ],
  },
  {
    round: 3,
    flag: '🇨🇳',
    country: 'CHINA',
    type: 'FEATURE RACE',
    date: '2026-09-14',
  },
  {
    round: 4,
    flag: '🇦🇿',
    country: 'AZERBAIJAN',
    type: 'SPRINT RACE',
    date: '2026-09-17',
  },
  {
    round: 5,
    flag: '🇯🇵',
    country: 'JAPAN',
    type: 'FEATURE RACE',
    date: '2026-09-21',
  },
  {
    round: 6,
    flag: '🇦🇹',
    country: 'AUSTRIA',
    type: 'SPRINT RACE',
    date: '2026-09-24',
  },
  {
    round: 7,
    flag: '🇬🇧',
    country: 'GREAT BRITAIN',
    type: 'SPRINT RACE',
    date: '2026-09-24',
  },
  {
    round: 8,
    flag: '🇭🇺',
    country: 'HUNGARY',
    type: 'SPRINT RACE',
    date: '2026-09-28',
  },
  {
    round: 9,
    flag: '🇧🇪',
    country: 'BELGIUM',
    type: 'FEATURE RACE',
    date: '2026-10-01',
  },
  {
    round: 10,
    flag: '🇮🇹',
    country: 'ITALY',
    type: 'SPRINT RACE',
    date: '2026-10-05',
  },
  {
    round: 11,
    flag: '🇸🇬',
    country: 'SINGAPORE',
    type: 'SPRINT RACE',
    date: '2026-10-05',
  },
  {
    round: 12,
    flag: '🇷🇺',
    country: 'RUSSIA',
    type: 'FEATURE RACE',
    date: '2026-10-08',
  },
  {
    round: 13,
    flag: '🇺🇸',
    country: 'USA',
    type: 'SPRINT RACE',
    date: '2026-10-12',
  },
  {
    round: 14,
    flag: '🇲🇽',
    country: 'MEXICO',
    type: 'FEATURE RACE',
    date: '2026-10-15',
  },
  {
    round: 15,
    flag: '🇧🇷',
    country: 'BRAZIL',
    type: 'FEATURE RACE',
    date: '2026-10-19',
  },
  {
    round: 16,
    flag: '🇦🇪',
    country: 'ABU DHABI',
    type: 'FEATURE RACE',
    date: '2026-10-22',
  },
]

export const formatRoundDate = (date: string) => {
  const [year, month, day] = date.split('-')

  return `${day}.${month}.${year.slice(-2)}`
}

export const todayISO = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
