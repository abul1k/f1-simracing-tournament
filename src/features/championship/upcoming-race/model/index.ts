import { computed, type ComputedRef } from 'vue'
import { getDriverCode } from '@/entities/driver/api'
import { isPodiumFinish } from '@/entities/round/model'
import { useDriversStore } from '@/entities/driver/model/store'
import { useRoundsStore } from '@/entities/round/model/store'
import { useTeamsStore } from '@/entities/team/model/store'
import { getCircuit } from '@/shared/config/circuits'
import {
  firstQualifying,
  getSessions,
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
