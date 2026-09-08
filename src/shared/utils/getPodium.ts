/**
 * Podium badges for the top three finishes, mirroring `getFlag`: the assets are
 * globbed rather than imported one by one, so adding or renaming a file here is
 * a change to `src/shared/assets/podium/` alone.
 */

const files = import.meta.glob<string>('../assets/podium/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** The file behind each finishing position. */
const names: Record<number, string> = {
  1: 'first-place',
  2: 'second-place',
  3: 'third-place',
}

const badges = Object.entries(files).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const name = path.split('/').pop()?.replace('.png', '') ?? ''
    acc[name] = url

    return acc
  },
  {},
)

/**
 * The badge for a podium finish.
 * @param position A finishing position; anything outside the top three has none.
 * @returns The image URL, or `undefined` — callers fall back to the plain number.
 */
export const getPodiumBadge = (position: number): string | undefined => {
  const name = names[position]

  return name ? badges[name] : undefined
}
