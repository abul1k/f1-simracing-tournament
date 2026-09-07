<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ScheduleWidget from '@/widgets/calendar/schedule.vue'
import { useRoundsStore } from '@/entities/round/model/store'

const route = useRoute()

const rounds = useRoundsStore()

const round = computed(() => rounds.getCalendarRound(Number(route.params.round)))
</script>

<template>
  <ScheduleWidget :round="round" />
</template>
