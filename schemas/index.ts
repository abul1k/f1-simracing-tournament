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
export const RACE_RESULT_STATUSES = ['finished', 'dnf', 'dsq'] as const
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
      teamId: { kind: 'string', pattern: /^TEAM_[A-Z0-9]+$/ },
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
            fields: {
              driverId: { kind: 'string', pattern: /^DRV\d{3}$/ },
              position: { kind: 'number', integer: true, min: 1 },
              time: { kind: 'string', pattern: LAP_TIME_PATTERN },
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
            optional: ['fastestLap', 'points'],
            fields: {
              driverId: { kind: 'string', pattern: /^DRV\d{3}$/ },
              // null for a `dnf`/`dsq`; validateData requires a number when the
              // driver is `finished`.
              position: { kind: 'number', integer: true, min: 1, nullable: true },
              gridPosition: { kind: 'number', integer: true, min: 1 },
              status: { kind: 'string', enum: RACE_RESULT_STATUSES },
              fastestLap: { kind: 'boolean' },
              points: { kind: 'number', integer: true, min: 0 },
            },
          },
        },
      },
    },
  },
}
