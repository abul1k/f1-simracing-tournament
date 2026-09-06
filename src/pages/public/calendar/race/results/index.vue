<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ResultsWidget from '@/widgets/calendar/results.vue'
import { defaultRounds } from '@/features/calendar/model'
import { getSession, longDate, raceTitle } from '@/features/race-day/schedule/model'

const route = useRoute()

const round = computed(() =>
  defaultRounds.find((item) => item.round === Number(route.params.round)),
)

const session = computed(() => getSession(round.value, route.params.session as string))
</script>

<template>
  <ResultsWidget
    :title="raceTitle(round)"
    :session-name="session?.name"
    :country="round?.country"
    :date="round ? longDate(round.date) : undefined"
    :round="round?.round"
  />
</template>
