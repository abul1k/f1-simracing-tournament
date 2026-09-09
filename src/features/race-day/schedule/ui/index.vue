<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@/shared/ui/badge/index.vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { getCircuit } from '@/shared/config/circuits'
import { getFlag } from '@/shared/utils/getFlag'
import {
  dayOf,
  getSessions,
  longDate,
  monthOf,
  raceTitle,
  sessionTime,
  type RaceRound,
} from '../model'

const props = defineProps<{
  round?: RaceRound
}>()

const fields: TableField[] = [
  { key: 'date', width: '70px' },
  { key: 'name' },
  { key: 'results', width: '120px', align: 'right' },
]

const sessions = computed(() => getSessions(props.round))
</script>

<template>
  <section v-if="props.round" class="flex w-full flex-col gap-7">
    <div class="flex flex-col gap-2.5">
      <RouterLink
        :to="{ name: 'calendar' }"
        class="flex w-fit items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] text-racing-red transition-opacity hover:opacity-75"
      >
        <svg
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        RACE CALENDAR
      </RouterLink>

      <div class="flex flex-wrap items-center gap-3">
        <img
          v-if="getFlag(props.round.country)"
          :src="getFlag(props.round.country)"
          :alt="props.round.country"
          class="h-6 w-auto shrink-0 rounded-[1px]"
        />
        <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">
          {{ raceTitle(props.round) }}
        </h1>
        <Badge variant="gray" size="sm" :dot="false">
          ROUND {{ props.round.round }}
        </Badge>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 text-[13px]">
        <span class="font-mono text-[#9C9CA1]">{{ longDate(props.round.date) }}</span>
        <span class="text-[#68686D]">·</span>
        <span class="text-[#9C9CA1]">{{ getCircuit(props.round.country) }}</span>
      </div>
    </div>

    <div class="flex flex-col">
      <h2 class="pb-4 text-[18px] font-extrabold text-[#F4F4F2]">SCHEDULE</h2>

      <Table
        :fields="fields"
        :items="sessions"
        row-key="key"
        min-width="480px"
        row-padding="px-5 py-4"
        hide-head
      >
        <template #cell(date)>
          <div class="flex flex-col leading-none">
            <span class="font-mono text-[15px] font-bold text-[#F4F4F2]">
              {{ dayOf(props.round!.date) }}
            </span>
            <span class="pt-1 text-[11px] font-bold tracking-[0.6px] text-[#68686D]">
              {{ monthOf(props.round!.date) }}
            </span>
          </div>
        </template>

        <template #cell(name)="{ item }">
          <div class="flex flex-col gap-1">
            <span class="text-[14px] font-bold text-[#F4F4F2]">{{ item.name }}</span>
            <span class="font-mono text-[12px] text-[#9C9CA1]">
              {{ sessionTime(item) }}
            </span>
          </div>
        </template>

        <template #cell(results)="{ item }">
          <div class="flex justify-end">
            <Button
              variant="outlined"
              size="sm"
              :to="{
                name: 'calendar-session',
                params: { round: props.round!.round, session: item.key },
              }"
            >
              RESULTS
            </Button>
          </div>
        </template>
      </Table>
    </div>
  </section>

  <section v-else class="flex w-full flex-col gap-4">
    <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">RACE NOT FOUND</h1>
    <RouterLink
      :to="{ name: 'calendar' }"
      class="text-[12px] font-bold tracking-[0.5px] text-racing-red"
    >
      BACK TO CALENDAR
    </RouterLink>
  </section>
</template>
