<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ScheduleWidget from '@/widgets/calendar/schedule.vue'
import { defaultRounds } from '@/features/calendar/model'

const route = useRoute()

const round = computed(() =>
  defaultRounds.find((item) => item.round === Number(route.params.round)),
)
</script>

<template>
  <ScheduleWidget :round="round" />
</template>
