import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getCalendar,
  getCalendarRound,
  getCompletedRounds,
  getLastCompletedRound,
  getNextRound,
  getQualifyingResults,
  getRaceResults,
  getRoundResults,
  getRoundTeam,
} from '../api'

export const useRoundsStore = defineStore('rounds', () => {
  const calendar = computed(() => getCalendar())
  const completedRounds = computed(() => getCompletedRounds())
  const nextRound = computed(() => getNextRound())
  const lastCompletedRound = computed(() => getLastCompletedRound())

  return {
    calendar,
    completedRounds,
    nextRound,
    lastCompletedRound,
    getCalendarRound,
    getRoundResults,
    getRaceResults,
    getQualifyingResults,
    getRoundTeam,
  }
})
