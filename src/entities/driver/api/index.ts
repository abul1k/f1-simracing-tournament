import driversJson from '@data/drivers.json'
import { getTeamById } from '@/entities/team/api'
import { isReserveDriver, type Driver, type DriverWithTeam } from '../model'

const drivers = driversJson as Driver[]

const byId = new Map(drivers.map((driver) => [driver.id, driver]))

/**
 * Three-letter abbreviations shown in results tables and podium cards.
 *
 * `data/drivers.json` carries no `code` field, so codes are derived from each
 * name: the last word first, then the first word if that is already taken, then
 * a numbered suffix. Derivation is deterministic because it follows file order.
 * Add an explicit `code` field to the data if you want to control these by hand.
 */
const codes = ((): Map<string, string> => {
  const assigned = new Map<string, string>()
  const used = new Set<string>()

  const abbreviate = (word: string): string =>
    word.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()

  drivers.forEach((driver) => {
    const words = driver.name.split(' ').filter(Boolean)
    const candidates = [
      abbreviate(words[words.length - 1] ?? driver.name),
      abbreviate(words[0] ?? driver.name),
    ]

    const free = candidates.find((code) => code.length === 3 && !used.has(code))
    const code = free ?? `${abbreviate(driver.name).slice(0, 2)}${driver.number % 10}`

    used.add(code)
    assigned.set(driver.id, code)
  })

  return assigned
})()

/** Returns every registered driver, in `data/drivers.json` order. */
export const getDrivers = (): Driver[] => drivers

/** Drivers holding a permanent seat — everyone but the reserve pool. */
export const getContractedDrivers = (): Driver[] =>
  drivers.filter((driver) => !isReserveDriver(driver))

/** The reserve pool: drivers with no seat, called up to stand in for a team. */
export const getReserveDrivers = (): Driver[] => drivers.filter(isReserveDriver)

/**
 * Looks up a single driver.
 * @param id A driver id such as `DRV001`.
 * @returns The driver, or `undefined` if no driver carries that id.
 */
export const getDriverById = (id: string): Driver | undefined => byId.get(id)

/** The driver's display name, falling back to the raw id if it is unknown. */
export const getDriverName = (id: string): string => byId.get(id)?.name ?? id

/** Returns every driver with its `teamId` already resolved to a team record. */
export const getDriversWithTeam = (): DriverWithTeam[] =>
  drivers.map((driver) => ({ ...driver, team: getTeamById(driver.teamId) }))

/**
 * Looks up a driver by the URL slug built from its name.
 * @param slug A slug such as `saidkamol-inomov`.
 * @param toSlug The slug function to match with, so this stays framework-agnostic.
 */
export const getDriverBySlug = (
  slug: string,
  toSlug: (value: string) => string,
): Driver | undefined => drivers.find((driver) => toSlug(driver.name) === slug)

/**
 * The driver's three-letter code, e.g. `INO`.
 * @param id A driver id such as `DRV001`.
 */
export const getDriverCode = (id: string): string => codes.get(id) ?? id.slice(-3)
