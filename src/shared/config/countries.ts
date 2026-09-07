/**
 * Display names for the country codes used in `data/drivers.json`.
 * Both 2-letter (ISO 3166-1 alpha-2) and 3-letter codes are accepted, since
 * the flag lookup in `getFlag` resolves either.
 */
export const countryNames: Record<string, string> = {
  UZ: 'Uzbekistan',
  UZB: 'Uzbekistan',
  KZ: 'Kazakhstan',
  KAZ: 'Kazakhstan',
  GB: 'Great Britain',
  GBR: 'Great Britain',
  IT: 'Italy',
  ITA: 'Italy',
  ES: 'Spain',
  ESP: 'Spain',
  RU: 'Russia',
  RUS: 'Russia',
  US: 'USA',
  USA: 'USA',
  BR: 'Brazil',
  BRA: 'Brazil',
  MX: 'Mexico',
  MEX: 'Mexico',
}

export const countryName = (code?: string): string =>
  code ? (countryNames[code.toUpperCase()] ?? code) : ''
