<script setup lang="ts">
import BannerUI from '@/features/banner/ui/index.vue'
import SeasonInfoUI from '@/features/championship/season-info/ui/index.vue'
import UpcomingRaceUI from '@/features/championship/upcoming-race/ui/index.vue'
import StandingsUI from '@/features/championship/standings/ui/index.vue'
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <BannerUI v-if="false" />
    <SeasonInfoUI />
    <UpcomingRaceUI />
    <StandingsUI />
  </div>
</template>
