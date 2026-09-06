<script setup lang="ts">
import DriverProfileUI from '@/features/driver-profile/ui/index.vue'
import type { ProfileRound, ProfileSource } from '@/features/driver-profile/model'

defineProps<{
  driver?: ProfileSource
  rounds: ProfileRound[]
  number?: number
}>()
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <DriverProfileUI :driver="driver" :rounds="rounds" :number="number" />
  </div>
</template>
