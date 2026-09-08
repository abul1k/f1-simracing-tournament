import { computed, type ComputedRef } from 'vue'
import { getDriverCode } from '@/entities/driver/api'
import { isPodiumFinish } from '@/entities/round/model'
import { useChampionshipStore } from '@/entities/championship/model/store'
import { useDriversStore } from '@/entities/driver/model/store'
import { useRoundsStore } from '@/entities/round/model/store'
import { useTeamsStore } from '@/entities/team/model/store'
import { getCircuit } from '@/shared/config/circuits'
import type { CalendarEvent } from '@/shared/utils/calendarEvent'
import {
  firstQualifying,
  getSession,
  getSessions,
  longDate,
  sessionStartsAt,
  sessionTime,
} from '@/features/race-day/schedule/model'

export interface Session {
  label: string
  value: string
}

export interface NextRace {
  round: string
  status: string
  flag: string
  country: string
  name: string
  circuit: string
  sessions: Session[]
  countdown: string
  /**
   * Local datetime the weekend's first qualifying session begins, e.g.
   * `2026-09-07T22:00:00`. Undefined only if the weekend has no qualifying.
   */
  startsAt?: string
  /** Name of that session, e.g. `QUALIFYING` or `SPRINT QUALIFYING`. */
  startsLabel: string
}

export interface LastResultRow {
  pos: number | string
  name: string
  code: string
  teamId: string | null
  team: string
}

export interface LastResult {
  /**
   * The round number itself, for linking through to the full result. Named
   * apart from `NextRace.round`, which is the display label (`ROUND 3`).
   */
  roundId: number
  flag: string
  country: string
  title: string
  results: LastResultRow[]
}

const MS_PER_MINUTE = 60_000

/**
 * Formats the gap to a session start as `NND NNH NNM`.
 * @param startsAt A local datetime such as `2026-09-07T22:00:00`.
 * @param from Reference time, defaulting to now. Injectable so this stays testable.
 */
export const formatCountdown = (
  startsAt: string,
  from: Date = new Date(),
): string => {
  const minutes = Math.max(
    0,
    Math.floor((new Date(startsAt).getTime() - from.getTime()) / MS_PER_MINUTE),
  )

  const pad = (value: number) => String(value).padStart(2, '0')

  return `${pad(Math.floor(minutes / 1440))}D ${pad(Math.floor(minutes / 60) % 24)}H ${pad(minutes % 60)}M`
}

/** The next unraced round, built from the calendar and the round files. */
export const useNextRace = (): ComputedRef<NextRace | undefined> => {
  const rounds = useRoundsStore()

  return computed(() => {
    const next = rounds.nextRound

    if (!next) return undefined

    const round = {
      round: next.round,
      country: next.country,
      type: next.type,
      date: next.date,
    }

    const quali = firstQualifying(round)
    const startsAt = quali ? sessionStartsAt(round, quali) : undefined

    return {
      round: `ROUND ${next.round}`,
      status: 'UPCOMING',
      flag: next.flag,
      country: next.country,
      name: `${next.country} GRAND PRIX`,
      circuit: getCircuit(next.country) ?? '',
      sessions: getSessions(round)
        .filter(
          (session) => session.key === quali?.key || session.key === 'race',
        )
        .map((session) => ({
          label: session.name,
          value: sessionTime(session),
        })),
      countdown: startsAt ? formatCountdown(startsAt) : '',
      startsAt,
      startsLabel: quali?.name ?? 'RACE WEEKEND',
    }
  })
}

/** The podium from the most recently completed round. */
export const useLastResult = (): ComputedRef<LastResult | undefined> => {
  const rounds = useRoundsStore()
  const drivers = useDriversStore()
  const teams = useTeamsStore()

  return computed(() => {
    const last = rounds.lastCompletedRound

    if (!last) return undefined

    const results = rounds
      .getRaceResults(last.round)
      .filter(isPodiumFinish)
      .map((result) => {
        const driver = drivers.getDriverById(result.driverId)
        // The livery shown is the one the drive counted for that round.
        const teamId = rounds.getRoundTeam(last.round, result.driverId)

        return {
          pos: result.position,
          name: driver?.name ?? result.driverId,
          code: getDriverCode(result.driverId),
          teamId,
          team: driver ? teams.getTeamName(teamId) : '',
        }
      })
      
    return {
      roundId: last.round,
      flag: last.flag,
      country: last.country,
      title: `ROUND ${last.round} · ${last.country}`,
      results,
    }
  })
}

/**
 * How long to block out for the race. The schedule gives the race a start time
 * but no end — it is the last session of the weekend — so the calendar entry
 * reserves an hour rather than showing as a zero-length event.
 */
const RACE_DURATION_MINUTES = 60

/**
 * The next race as a calendar event, ready to hand to the visitor's device.
 *
 * The event is the race itself, not the whole weekend: that is the date someone
 * pressing "add to calendar" means. The rest of the weekend's running order
 * rides along in the description so they still have it.
 *
 * @returns The event, or `undefined` once the season has no rounds left.
 */
export const useNextRaceEvent = (): ComputedRef<CalendarEvent | undefined> => {
  const rounds = useRoundsStore()
  const championship = useChampionshipStore()

  return computed(() => {
    const next = rounds.nextRound

    if (!next) return undefined

    const round = {
      round: next.round,
      country: next.country,
      type: next.type,
      date: next.date,
    }

    const race = getSession(round, 'race')

    if (!race) return undefined

    const schedule = getSessions(round)
      .map((session) => `${session.name} — ${sessionTime(session)}`)
      .join('\n')

    return {
      // Tied to the round, so adding the same race twice updates the existing
      // entry in most calendar apps instead of duplicating it.
      uid: `round-${next.round}-${next.date}@f1uzbekistan`,
      title: `Round ${next.round}: ${next.country} Grand Prix`,
      location: getCircuit(next.country) ?? next.country,
      description: [
        `${championship.championship.name} — Round ${next.round} of ${championship.roundsTotal}.`,
        `${longDate(next.date)}, ${next.type.toLowerCase()}.`,
        '',
        'Weekend schedule:',
        schedule,
      ].join('\n'),
      startsAt: sessionStartsAt(round, race),
      durationMinutes: RACE_DURATION_MINUTES,
    }
  })
}
