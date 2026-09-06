export interface SessionResultRow {
  pos: number | string
  no: number
  driver: string
  code: string
  team: string
  time: string
  laps: number
}

export const defaultSessionResults: SessionResultRow[] = [
  { pos: 1, no: 7, driver: 'Abdulaziz', code: 'ABD', team: 'Mercedes', time: '1:32.741', laps: 29 },
  { pos: 2, no: 14, driver: 'Sardor', code: 'SAR', team: 'Mercedes', time: '+0.120s', laps: 30 },
  { pos: 3, no: 4, driver: 'Bobur', code: 'BOB', team: 'McLaren', time: '+0.555s', laps: 29 },
  { pos: 4, no: 22, driver: 'Bekzod', code: 'BEK', team: 'McLaren', time: '+0.731s', laps: 28 },
  { pos: 5, no: 16, driver: 'Timur', code: 'TIM', team: 'Ferrari', time: '+0.858s', laps: 28 },
  { pos: 6, no: 44, driver: 'Javlon', code: 'JAV', team: 'Ferrari', time: '+1.388s', laps: 26 },
  { pos: 7, no: 87, driver: 'Anvar', code: 'ANV', team: 'Haas', time: '+1.685s', laps: 28 },
  { pos: 8, no: 33, driver: 'Aziz', code: 'AZI', team: 'Red Bull Racing', time: '+1.800s', laps: 24 },
  { pos: 9, no: 27, driver: 'Davron', code: 'DAV', team: 'Alfa Romeo', time: '+1.898s', laps: 27 },
  { pos: 10, no: 10, driver: 'Jamshid', code: 'JAM', team: 'Renault', time: '+1.935s', laps: 28 },
  { pos: 11, no: 30, driver: 'Diyor', code: 'DIY', team: 'AlphaTauri', time: '+2.032s', laps: 29 },
  { pos: 12, no: 5, driver: 'Sanjar', code: 'SAN', team: 'Alfa Romeo', time: '+2.097s', laps: 26 },
  { pos: 13, no: 11, driver: 'Otabek', code: 'OTA', team: 'Red Bull Racing', time: '+2.244s', laps: 27 },
  { pos: 14, no: 18, driver: 'Ulugbek', code: 'ULU', team: 'Racing Point', time: '+2.510s', laps: 28 },
  { pos: 15, no: 31, driver: 'Shahzod', code: 'SHA', team: 'Renault', time: '+2.764s', laps: 25 },
  { pos: 16, no: 9, driver: 'Farrukh', code: 'FAR', team: 'Racing Point', time: '+2.903s', laps: 27 },
  { pos: 17, no: 24, driver: 'Islom', code: 'ISL', team: 'AlphaTauri', time: '+3.117s', laps: 26 },
  { pos: 18, no: 6, driver: 'Nodir', code: 'NOD', team: 'Williams', time: '+3.480s', laps: 28 },
  { pos: 19, no: 23, driver: 'Elyor', code: 'ELY', team: 'Williams', time: '+3.902s', laps: 24 },
  { pos: 20, no: 20, driver: 'Rustam', code: 'RUS', team: 'Haas', time: '+4.365s', laps: 22 },
]
