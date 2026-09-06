<script setup lang="ts">
import ResultsUI from '@/features/race-day/results/ui/index.vue'

defineProps<{
  title?: string
  sessionName?: string
  country?: string
  date?: string
  round?: number
}>()
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <ResultsUI
      :title="title"
      :session-name="sessionName"
      :country="country"
      :date="date"
      :round="round"
    />
  </div>
</template>
