export const countryNames: Record<string, string> = {
  UZB: 'Uzbekistan',
  KAZ: 'Kazakhstan',
  GBR: 'Great Britain',
  ITA: 'Italy',
  ESP: 'Spain',
  RUS: 'Russia',
  USA: 'USA',
  BRA: 'Brazil',
  MEX: 'Mexico',
}

export const countryName = (code?: string) =>
  code ? (countryNames[code.toUpperCase()] ?? code) : ''
