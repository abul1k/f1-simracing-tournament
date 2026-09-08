/**
 * Structural schemas for every file under `data/`.
 *
 * These are the contract admins edit against. `scripts/validateData.ts` checks
 * each data file here before the site is allowed to build, and also checks the
 * cross-file references (a `teamId` that no team defines, and so on) that a
 * per-file schema cannot express.
 */

import type { Spec } from '../scripts/lib/schema.ts'

/** ISO calendar date, `YYYY-MM-DD`. */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Lap or sector time, `M:SS.mmm`. */
const LAP_TIME_PATTERN = /^\d+:\d{2}\.\d{3}$/

/** Hex colour, `#RRGGBB`. */
const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/

export const SESSION_STATUSES = ['pending', 'completed'] as const
export const RACE_RESULT_STATUSES = ['finished', 'dnf', 'dsq', 'dns'] as const
/** Only set on a qualifying entry with no lap time; omitted for a timed lap. */
export const QUALIFYING_RESULT_STATUSES = ['dnf', 'dsq', 'dns'] as const
export const RACE_TYPES = ['FEATURE RACE', 'SPRINT RACE'] as const
export const CHAMPIONSHIP_STATUSES = ['active', 'completed', 'upcoming'] as const
export const FASTEST_LAP_ELIGIBILITY = ['top10', 'any'] as const

export const championshipSchema: Spec = {
  kind: 'object',
  fields: {
    id: { kind: 'string', minLength: 1 },
    name: { kind: 'string', minLength: 1 },
    season: { kind: 'number', integer: true, min: 1 },
    game: { kind: 'string', minLength: 1 },
    category: { kind: 'string', minLength: 1 },
    platform: { kind: 'string', minLength: 1 },
    region: { kind: 'string', minLength: 1 },
    status: { kind: 'string', enum: CHAMPIONSHIP_STATUSES },
    scoring: {
      kind: 'record',
      keyPattern: /^\d+$/,
      of: { kind: 'number', integer: true, min: 0 },
    },
    bonusPoints: {
      kind: 'object',
      fields: {
        fastestLap: { kind: 'number', integer: true, min: 0 },
        fastestLapEligibility: { kind: 'string', enum: FASTEST_LAP_ELIGIBILITY },
      },
    },
    driverCount: { kind: 'number', integer: true, min: 1 },
    roundsTotal: { kind: 'number', integer: true, min: 1 },
  },
}

export const teamsSchema: Spec = {
  kind: 'array',
  minItems: 1,
  of: {
    kind: 'object',
    fields: {
      id: { kind: 'string', pattern: /^TEAM_[A-Z0-9]+$/ },
      name: { kind: 'string', minLength: 1 },
      shortName: { kind: 'string', minLength: 1 },
      color: { kind: 'string', pattern: HEX_COLOR_PATTERN },
    },
  },
}

export const driversSchema: Spec = {
  kind: 'array',
  minItems: 1,
  of: {
    kind: 'object',
    fields: {
      id: { kind: 'string', pattern: /^DRV\d{3}$/ },
      name: { kind: 'string', minLength: 1 },
      number: { kind: 'number', integer: true, min: 1, max: 99 },
      // null marks a reserve driver — no permanent seat. The team they stand in
      // for is recorded per round, as `racedFor` on that round's results.
      teamId: { kind: 'string', pattern: /^TEAM_[A-Z0-9]+$/, nullable: true },
      country: { kind: 'string', minLength: 2 },
    },
  },
}

export const calendarSchema: Spec = {
  kind: 'array',
  minItems: 1,
  of: {
    kind: 'object',
    fields: {
      round: { kind: 'number', integer: true, min: 1 },
      flag: { kind: 'string', minLength: 2 },
      country: { kind: 'string', minLength: 1 },
      type: { kind: 'string', enum: RACE_TYPES },
      date: { kind: 'string', pattern: DATE_PATTERN },
    },
  },
}

export const roundSchema: Spec = {
  kind: 'object',
  fields: {
    round: { kind: 'number', integer: true, min: 1 },
    qualifying: {
      kind: 'object',
      fields: {
        status: { kind: 'string', enum: SESSION_STATUSES },
        results: {
          kind: 'array',
          of: {
            kind: 'object',
            // `status` says why an entry has no lap time; validateData
            // requires one whenever `time` is empty. `racedFor` is only needed
            // for a driver standing in for a team — see validateData.
            optional: ['status', 'racedFor'],
            fields: {
              driverId: { kind: 'string', pattern: /^DRV\d{3}$/ },
              // null for a driver who took no part at all, i.e. a `dns`.
              position: { kind: 'number', integer: true, min: 1, nullable: true },
              // Empty for a driver who set no lap time — see `status`.
              time: { kind: 'string', pattern: LAP_TIME_PATTERN, allowEmpty: true },
              status: { kind: 'string', enum: QUALIFYING_RESULT_STATUSES },
              racedFor: { kind: 'string', pattern: /^TEAM_[A-Z0-9]+$/ },
            },
          },
        },
      },
    },
    race: {
      kind: 'object',
      fields: {
        status: { kind: 'string', enum: SESSION_STATUSES },
        results: {
          kind: 'array',
          of: {
            kind: 'object',
            // `fastestLap` and `points` may be omitted by admins:
            // `scripts/calculatePoints.ts` fills both in before the site builds.
            // `racedFor` is only needed for a driver standing in for a team.
            optional: ['fastestLap', 'points', 'racedFor'],
            fields: {
              driverId: { kind: 'string', pattern: /^DRV\d{3}$/ },
              // A classified retirement may carry a position; null leaves the
              // driver out of the classification. validateData requires a
              // number when the driver is `finished`, and null for a `dns`.
              position: { kind: 'number', integer: true, min: 1, nullable: true },
              // null when the driver took no grid slot, e.g. a `dns`.
              gridPosition: { kind: 'number', integer: true, min: 1, nullable: true },
              status: { kind: 'string', enum: RACE_RESULT_STATUSES },
              fastestLap: { kind: 'boolean' },
              points: { kind: 'number', integer: true, min: 0 },
              // The team this drive counts for in the constructors' table.
              // Defaults to the driver's own `teamId` when absent.
              racedFor: { kind: 'string', pattern: /^TEAM_[A-Z0-9]+$/ },
            },
          },
        },
      },
    },
  },
}
