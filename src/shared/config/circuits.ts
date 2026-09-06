export const circuits: Record<string, string> = {
  Australia: 'Albert Park Circuit, Melbourne',
  Bahrain: 'Bahrain International Circuit, Sakhir',
  China: 'Shanghai International Circuit, Shanghai',
  Azerbaijan: 'Baku City Circuit, Baku',
  Japan: 'Suzuka International Racing Course, Suzuka',
  Austria: 'Red Bull Ring, Spielberg',
  'Great Britain': 'Silverstone Circuit, Silverstone',
  Hungary: 'Hungaroring, Budapest',
  Belgium: 'Circuit de Spa-Francorchamps, Stavelot',
  Italy: 'Autodromo Nazionale Monza, Monza',
  Singapore: 'Marina Bay Street Circuit, Singapore',
  Russia: 'Sochi Autodrom, Sochi',
  USA: 'Circuit of the Americas, Austin',
  Mexico: 'Autodromo Hermanos Rodriguez, Mexico City',
  Brazil: 'Autodromo Jose Carlos Pace, Sao Paulo',
  'Abu Dhabi': 'Yas Marina Circuit, Abu Dhabi',
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '')

const lookup = Object.entries(circuits).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[normalize(key)] = value

  return acc
}, {})

export const getCircuit = (country?: string) =>
  country ? lookup[normalize(country)] : undefined
