import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getConstructorStandings,
  getDriverStanding,
  getDriverStandings,
  getStandings,
} from '../api'

export const useStandingsStore = defineStore('standings', () => {
  const standings = computed(() => getStandings())

  const driverStandings = computed(() => getDriverStandings())
  const constructorStandings = computed(() => getConstructorStandings())
  const roundsCompleted = computed(() => standings.value.roundsCompleted)

  return {
    standings,
    driverStandings,
    constructorStandings,
    roundsCompleted,
    getDriverStanding,
  }
})
