import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getTeamById, getTeamColor, getTeamName, getTeams } from '../api'

export const useTeamsStore = defineStore('teams', () => {
  const teams = computed(() => getTeams())

  const teamCount = computed(() => teams.value.length)

  return {
    teams,
    teamCount,
    getTeamById,
    getTeamColor,
    getTeamName,
  }
})
