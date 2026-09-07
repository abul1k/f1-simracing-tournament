<script setup lang="ts">
import DriverProfileUI from '@/features/driver-profile/ui/index.vue'
import type { ProfileHeader } from '@/features/driver-profile/model'

defineProps<{
  driver?: ProfileHeader
}>()
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <DriverProfileUI :driver="driver" />
  </div>
</template>
