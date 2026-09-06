<script setup lang="ts">
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { teamColor } from '@/shared/config/teams'
import { getCircuit } from '@/shared/config/circuits'
import { getFlag } from '@/shared/utils/getFlag'
import { defaultSessionResults, type SessionResultRow } from '../model'

const props = withDefaults(
  defineProps<{
    title?: string
    sessionName?: string
    country?: string
    date?: string
    round?: number
    results?: SessionResultRow[]
  }>(),
  {
    results: () => defaultSessionResults,
  },
)

const fields: TableField[] = [
  {
    key: 'pos',
    label: 'POS.',
    width: '60px',
    class: 'font-mono text-[14px] font-bold text-[#F4F4F2]',
  },
  {
    key: 'no',
    label: 'NO.',
    width: '60px',
    class: 'font-mono text-[14px] font-medium text-[#9C9CA1]',
  },
  { key: 'driver', label: 'DRIVER' },
  { key: 'team', label: 'TEAM', width: '200px' },
  {
    key: 'time',
    label: 'TIME / GAP',
    width: '130px',
    class: 'font-mono text-[13px] font-medium text-[#F4F4F2]',
  },
  {
    key: 'laps',
    label: 'LAPS',
    width: '70px',
    align: 'right',
    class: 'font-mono text-[13px] font-medium text-[#9C9CA1]',
  },
]
</script>

<template>
  <section class="flex w-full flex-col gap-7">
    <div class="flex flex-col gap-2.5">
      <RouterLink
        v-if="props.round"
        :to="{ name: 'calendar-schedule', params: { round: props.round } }"
        class="flex w-fit items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] text-[#C13B33] transition-opacity hover:opacity-75"
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
        SCHEDULE
      </RouterLink>

      <div class="flex flex-wrap items-center gap-3">
        <img
          v-if="getFlag(props.country)"
          :src="getFlag(props.country)"
          :alt="props.country"
          class="h-6 w-auto shrink-0 rounded-[1px]"
        />
        <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">
          {{ props.title }}
          <span v-if="props.sessionName" class="text-[#68686D]">—</span>
          <span v-if="props.sessionName">{{ props.sessionName }}</span>
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 text-[13px]">
        <span class="font-mono text-[#9C9CA1]">{{ props.date }}</span>
        <span class="text-[#68686D]">·</span>
        <span class="text-[#9C9CA1]">{{ getCircuit(props.country) }}</span>
      </div>
    </div>

    <Table
      :fields="fields"
      :items="props.results"
      row-key="code"
      min-width="820px"
      row-padding="px-5 py-3.25"
    >
      <template #cell(driver)="{ item }">
        <div class="flex items-center gap-2.5">
          <span
            class="h-[18px] w-[18px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(item.team) }"
          ></span>
          <span class="text-[14px] font-semibold text-[#F4F4F2]">{{ item.driver }}</span>
          <span class="font-mono text-[12px] text-[#68686D]">{{ item.code }}</span>
        </div>
      </template>

      <template #cell(team)="{ value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[7px] w-[7px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(value) }"
          ></span>
          <span class="truncate text-[13px] text-[#9C9CA1]">{{ value }}</span>
        </div>
      </template>
    </Table>
  </section>
</template>
