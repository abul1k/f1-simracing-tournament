<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ResultsWidget from '@/widgets/calendar/results.vue'
import { useRoundsStore } from '@/entities/round/model/store'
import { useSessionResults } from '@/features/race-day/results/model'
import { getSession, longDate, raceTitle } from '@/features/race-day/schedule/model'

const route = useRoute()

const rounds = useRoundsStore()

const roundNumber = computed(() => Number(route.params.round))

const round = computed(() => rounds.getCalendarRound(roundNumber.value))

const sessionKey = computed(() => route.params.session as string)

const session = computed(() => getSession(round.value, sessionKey.value))

const results = useSessionResults(roundNumber, sessionKey)
</script>

<template>
  <ResultsWidget
    :title="raceTitle(round)"
    :session-name="session?.name"
    :country="round?.country"
    :date="round ? longDate(round.date) : undefined"
    :round="round?.round"
    :results="results"
  />
</template>
