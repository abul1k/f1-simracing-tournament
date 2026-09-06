<script setup lang="ts">
import DriversUI from '@/features/drivers/ui/index.vue'
import type { DriverSource } from '@/features/drivers/model'

defineProps<{
  source: DriverSource[]
}>()
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <DriversUI :source="source" />
  </div>
</template>
