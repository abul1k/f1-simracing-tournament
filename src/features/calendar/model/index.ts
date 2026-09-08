import { computed, type ComputedRef } from 'vue'
import { useRoundsStore } from '@/entities/round/model/store'
import { getDriverCode } from '@/entities/driver/api'
import { isPodiumFinish, type RaceType } from '@/entities/round/model'

export type { RaceType }

export interface PodiumEntry {
  code: string
  /** The team the drive counted for that round, not the driver's own seat. */
  teamId: string | null
  /**
   * Race results carry no lap time in `data/rounds/`, so this is undefined for
   * race podiums and the card renders a dash.
   */
  time?: string
}

/** A calendar card, with the podium filled in once a round's race is completed. */
export interface CalendarRound {
  round: number
  flag: string
  country: string
  type: RaceType
  date: string
  podium?: PodiumEntry[]
}

export const podiumLabels = ['1ST', '2ND', '3RD']

export const formatRoundDate = (date: string): string => {
  const [year, month, day] = date.split('-')

  return `${day}.${month}.${year.slice(-2)}`
}

export const todayISO = (): string => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** The season calendar, each round joined with its podium if the race is done. */
export const useCalendarRounds = (): ComputedRef<CalendarRound[]> => {
  const rounds = useRoundsStore()

  return computed(() =>
    rounds.calendar.map((entry) => {
      const results = rounds.getRaceResults(entry.round)

      if (results.length === 0) return { ...entry }

      const podium = results
        .filter(isPodiumFinish)
        .map((result) => ({
          code: getDriverCode(result.driverId),
          teamId: rounds.getRoundTeam(entry.round, result.driverId),
        }))

      return podium.length ? { ...entry, podium } : { ...entry }
    }),
  )
}
