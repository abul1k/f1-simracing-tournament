export const teamColors: Record<string, string> = {
  Mercedes: '#00D2BE',
  Ferrari: '#DC0000',
  'Red Bull Racing': '#1E41FF',
  McLaren: '#FF8700',
  Renault: '#FFF500',
  'Racing Point': '#F596C8',
  AlphaTauri: '#4E7C9B',
  Haas: '#B6BABD',
  'Alfa Romeo': '#9B0000',
  Williams: '#00A0DE',
}

export const teamColor = (team: string) => teamColors[team] ?? '#68686D'

export const teamGradient = (team: string) => {
  const color = teamColor(team)

  return `linear-gradient(76deg, color-mix(in srgb, ${color} 22%, #000) 7%, color-mix(in srgb, ${color} 60%, #000) 54%, ${color} 93%)`
}

const brightness = (hex: string) => {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)

  return (r * 0.299 + g * 0.587 + b * 0.114) / 255
}

export const isLightTeam = (team: string) => brightness(teamColor(team)) > 0.55

export const teamInk = (team: string) =>
  isLightTeam(team)
    ? { strong: '#0A0A0B', soft: '#0A0A0BB3', line: '#0A0A0B26' }
    : { strong: '#FFFFFF', soft: '#FFFFFFD9', line: '#FFFFFF30' }
