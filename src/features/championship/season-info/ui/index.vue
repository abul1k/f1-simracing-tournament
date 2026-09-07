<script setup lang="ts">
import Badge from '@/shared/ui/badge/index.vue'
import Button from '@/shared/ui/button/index.vue'
import { getFlag } from '@/shared/utils/getFlag'
import { useSeasonHeader, useSeasonInfo } from '../model'

const header = useSeasonHeader()
const info = useSeasonInfo()

defineEmits<{
  viewStandings: []
  viewNextRace: []
}>()
</script>

<template>
  <section class="flex w-full flex-col gap-9">
    <div class="flex flex-col items-start justify-between gap-6 lg:flex-row">
      <div class="flex flex-col items-start gap-2.5">
        <p class="text-[12px] font-bold tracking-[1.2px] text-[#C13B33]">
          {{ header.eyebrow }}
        </p>
        <h1 class="text-[40px] font-extrabold text-[#F4F4F2]">{{ header.title }}</h1>
        <div class="flex items-center gap-2.5 text-[13px]">
          <img
            v-if="getFlag(header.region)"
            :src="getFlag(header.region)"
            :alt="header.region"
            class="h-3.5 w-auto shrink-0 rounded-[1px]"
          />
          <span class="text-[#9C9CA1]">{{ header.region }}</span>
          <span class="text-[#68686D]">·</span>
          <span class="text-[#9C9CA1]">{{ header.game }}</span>
        </div>
      </div>

      <div class="flex flex-col items-start gap-3.5 lg:items-end">
        <Badge variant="green">{{ header.status }}</Badge>
        <div class="flex gap-3">
          <Button variant="filled" @click="$emit('viewStandings')">VIEW STANDINGS</Button>
          <Button variant="outlined" @click="$emit('viewNextRace')">NEXT RACE</Button>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-col border border-[#2A2A2E] bg-[#141416] lg:flex-row">
      <div
        v-for="(item, index) in info"
        :key="item.label"
        class="flex flex-1 flex-col gap-1 px-6 py-4.5"
        :class="index > 0 && 'border-t border-[#2A2A2E] lg:border-t-0 lg:border-l'"
      >
        <span class="font-mono text-[22px] font-semibold whitespace-nowrap text-[#F4F4F2]">
          {{ item.value }}
        </span>
        <span class="text-[11px] font-semibold tracking-[0.8px] text-[#68686D]">
          {{ item.label }}
        </span>
      </div>
    </div>
  </section>
</template>
