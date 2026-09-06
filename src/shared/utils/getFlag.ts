const files = import.meta.glob<string>('../assets/flags/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '')

const flags = Object.entries(files).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const name = path.split('/').pop()?.replace('.png', '') ?? ''
    acc[normalize(name)] = url

    return acc
  },
  {},
)

const aliases: Record<string, string> = {
  abudhabi: 'uae',
  unitedarabemirates: 'uae',
  emirates: 'uae',
  unitedstates: 'usa',
  unitedstatesofamerica: 'usa',
  america: 'usa',
  unitedkingdom: 'greatbritain',
  uk: 'greatbritain',
  uz: 'uzbekistan',
  uzb: 'uzbekistan',
  gb: 'greatbritain',
  britain: 'greatbritain',
  england: 'greatbritain',
}

export const getFlag = (country?: string) => {
  if (!country) return undefined

  const key = normalize(country)

  return flags[aliases[key] ?? key]
}

export const hasFlag = (country?: string) => Boolean(getFlag(country))
