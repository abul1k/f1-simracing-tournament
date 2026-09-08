import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getContractedDrivers,
  getDriverById,
  getDriverBySlug,
  getDriverName,
  getDrivers,
  getDriversWithTeam,
  getReserveDrivers,
} from '../api'

export const useDriversStore = defineStore('drivers', () => {
  const drivers = computed(() => getDrivers())
  const driversWithTeam = computed(() => getDriversWithTeam())
  const reserveDrivers = computed(() => getReserveDrivers())

  /** The size of the grid — reserves are cover, not a seat, so they are not counted. */
  const driverCount = computed(() => getContractedDrivers().length)
  const reserveCount = computed(() => reserveDrivers.value.length)

  return {
    drivers,
    driversWithTeam,
    reserveDrivers,
    driverCount,
    reserveCount,
    getDriverById,
    getDriverBySlug,
    getDriverName,
  }
})
