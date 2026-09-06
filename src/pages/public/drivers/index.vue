<script setup lang="ts">
import DriversWidget from '@/widgets/drivers/index.vue'
import { defaultDriverStandings } from '@/features/standings/model'
</script>

<template>
  <DriversWidget :source="defaultDriverStandings" />
</template>
