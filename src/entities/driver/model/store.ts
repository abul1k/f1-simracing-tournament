import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getDriverById,
  getDriverBySlug,
  getDriverName,
  getDrivers,
  getDriversWithTeam,
} from '../api'

export const useDriversStore = defineStore('drivers', () => {
  const drivers = computed(() => getDrivers())
  const driversWithTeam = computed(() => getDriversWithTeam())

  const driverCount = computed(() => drivers.value.length)

  return {
    drivers,
    driversWithTeam,
    driverCount,
    getDriverById,
    getDriverBySlug,
    getDriverName,
  }
})
