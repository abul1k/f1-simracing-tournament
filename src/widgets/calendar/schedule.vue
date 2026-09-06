<script setup lang="ts">
import ScheduleUI from '@/features/race-day/schedule/ui/index.vue'
import type { RaceRound } from '@/features/race-day/schedule/model'

defineProps<{
  round?: RaceRound
}>()
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <ScheduleUI :round="round" />
  </div>
</template>
