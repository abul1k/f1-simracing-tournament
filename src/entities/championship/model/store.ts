import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getChampionship,
  getFastestLapBonus,
  isFastestLapEligible,
  pointsForPosition,
} from '../api'

export const useChampionshipStore = defineStore('championship', () => {
  const championship = computed(() => getChampionship())

  const scoring = computed(() => championship.value.scoring)
  const roundsTotal = computed(() => championship.value.roundsTotal)
  const driverCount = computed(() => championship.value.driverCount)

  /** Section eyebrow shown above page titles, e.g. `SEASON 1`. */
  const seasonLabel = computed(() => `SEASON ${championship.value.season}`)

  return {
    championship,
    scoring,
    roundsTotal,
    driverCount,
    seasonLabel,
    pointsForPosition,
    isFastestLapEligible,
    fastestLapBonus: getFastestLapBonus(),
  }
})
