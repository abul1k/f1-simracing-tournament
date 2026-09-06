export interface Session {
  label: string
  value: string
}

export interface NextRace {
  round: string
  status: string
  flag: string
  country: string
  name: string
  circuit: string
  sessions: Session[]
  countdown: string
  startsAt?: string
}

export interface LastResultRow {
  pos: number | string
  name: string
  team: string
}

export interface LastResult {
  flag: string
  country: string
  title: string
  results: LastResultRow[]
}

export const defaultNextRace: NextRace = {
  round: 'ROUND 6',
  status: 'UPCOMING',
  flag: '🇬🇧',
  country: 'Great Britain',
  name: 'BRITISH GRAND PRIX',
  circuit: 'Silverstone Circuit',
  sessions: [
    { label: 'QUALIFYING', value: 'Saturday · 19:00' },
    { label: 'RACE', value: 'Saturday · 20:00' },
  ],
  countdown: '06D 09H 15M',
}

export const defaultLastResult: LastResult = {
  flag: '🇲🇨',
  country: 'Monaco',
  title: 'ROUND 5 · MONACO',
  results: [
    { pos: 1, name: 'Abdulaziz', team: 'Mercedes' },
    { pos: 2, name: 'Timur', team: 'Ferrari' },
    { pos: 3, name: 'Aziz', team: 'Red Bull' },
  ],
}
