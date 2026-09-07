/** Pure colour helpers. These know nothing about teams — pass them a hex colour. */

export const FALLBACK_COLOR = '#68686D'

/** Builds the diagonal podium gradient used behind the top three. */
export const gradientFrom = (color: string): string =>
  `linear-gradient(76deg, color-mix(in srgb, ${color} 22%, #000) 7%, color-mix(in srgb, ${color} 60%, #000) 54%, ${color} 93%)`

/** Perceived brightness of a `#RRGGBB` colour, 0 (black) to 1 (white). */
export const brightness = (hex: string): number => {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)

  return (r * 0.299 + g * 0.587 + b * 0.114) / 255
}

export const isLight = (color: string): boolean => brightness(color) > 0.55

export interface Ink {
  strong: string
  soft: string
  line: string
}

/** Text and divider colours that stay readable on top of `color`. */
export const inkFor = (color: string): Ink =>
  isLight(color)
    ? { strong: '#0A0A0B', soft: '#0A0A0BB3', line: '#0A0A0B26' }
    : { strong: '#FFFFFF', soft: '#FFFFFFD9', line: '#FFFFFF30' }
