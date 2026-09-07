<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { teamColor } from '@/entities/team/lib'
import { useChampionshipStore } from '@/entities/championship/model/store'
import { getFlag } from '@/shared/utils/getFlag'
import {
  isRetired,
  useCompletedRounds,
  useConstructorStandings,
  useDriverStandings,
  type RoundResult,
} from '../model'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
  }>(),
  {
    eyebrow: '',
    title: 'Championship Standings',
  },
)

const championship = useChampionshipStore()

const standings = useDriverStandings()
const constructors = useConstructorStandings()
const completedRounds = useCompletedRounds()

const tab = ref<'drivers' | 'constructors'>('drivers')

const eyebrow = computed(() => props.eyebrow || championship.seasonLabel)

/** False before any race has been run — the tables would be all zeroes. */
const hasResults = computed(() => completedRounds.value.length > 0)

// Columns are labelled with the real round number, so a season with a skipped
// or postponed round still reads correctly (R1, R3 — not R1, R2).
const roundFields = computed<TableField[]>(() =>
  completedRounds.value.map((round, index) => ({
    key: `results.${index}`,
    label: `R${round}`,
    width: '56px',
    class: 'font-mono text-[12px] font-medium',
  })),
)

const driverFields = computed<TableField[]>(() => [
  {
    key: 'pos',
    label: 'POS',
    width: '60px',
    class: 'font-mono text-[13px] font-bold',
  },
  {
    key: 'driver',
    label: 'DRIVER',
    class: 'text-[13px] font-semibold text-[#F4F4F2]',
  },
  { key: 'team', label: 'TEAM', width: '190px' },
  ...roundFields.value,
  {
    key: 'pts',
    label: 'PTS',
    width: '64px',
    class: 'font-mono text-[13px] font-bold',
  },
])

const constructorFields: TableField[] = [
  {
    key: 'pos',
    label: 'POS',
    width: '60px',
    class: 'font-mono text-[13px] font-bold',
  },
  { key: 'team', label: 'TEAM' },
  { key: 'drivers', label: 'DRIVERS', width: '260px' },
  {
    key: 'pts',
    label: 'PTS',
    width: '64px',
    class: 'font-mono text-[13px] font-bold',
  },
]

const tableWidth = computed(() => `${584 + completedRounds.value.length * 56}px`)

const resultClass = (value: RoundResult, pos: number) => {
  if (isRetired(value)) return 'font-semibold text-[#C13B33]'

  return pos <= 10 ? 'text-[#9C9CA1]' : 'text-[#68686D]'
}
</script>

<template>
  <section class="flex w-full flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <p class="text-[12px] font-bold tracking-[1.2px] text-[#C13B33]">
        {{ eyebrow }}
      </p>
      <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">
        {{ props.title }}
      </h1>
    </div>

    <div v-if="hasResults" class="flex gap-2">
      <Button
        :variant="tab === 'drivers' ? 'filled' : 'outlined'"
        @click="tab = 'drivers'"
      >
        DRIVERS
      </Button>
      <Button
        :variant="tab === 'constructors' ? 'filled' : 'outlined'"
        @click="tab = 'constructors'"
      >
        CONSTRUCTORS
      </Button>
    </div>

    <div
      v-if="!hasResults"
      class="flex flex-col items-center gap-2 border border-[#2A2A2E] bg-[#141416] px-6 py-14 text-center"
    >
      <p class="text-[15px] font-bold text-[#F4F4F2]">No races completed yet</p>
      <p class="max-w-[420px] text-[13px] text-[#68686D]">
        Standings appear here once a round's race is marked completed.
      </p>
    </div>

    <Table
      v-else-if="tab === 'drivers'"
      :fields="driverFields"
      :items="standings"
      row-key="driver"
      :min-width="tableWidth"
    >
      <template #cell(pos)="{ item, value }">
        <span :class="item.pos <= 3 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>

      <template #cell(driver)="{ item, value }">
        <div class="flex items-center gap-2.5">
          <img
            v-if="getFlag(item.nationality)"
            :src="getFlag(item.nationality)"
            :alt="item.nationality"
            class="h-3 w-auto shrink-0 rounded-[1px]"
          />
          <span class="truncate">{{ value }}</span>
        </div>
      </template>

      <template #cell(team)="{ item, value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[6px] w-[6px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(item.teamId) }"
          ></span>
          <span class="truncate text-[12px] text-[#9C9CA1]">{{ value }}</span>
        </div>
      </template>

      <template
        v-for="(_field, index) in roundFields"
        :key="index"
        #[`cell(results.${index})`]="{ item, value }"
      >
        <span :class="resultClass(value, item.pos)">{{ value ?? '—' }}</span>
      </template>

      <template #cell(pts)="{ item, value }">
        <span :class="item.pos <= 10 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>
    </Table>

    <Table v-else :fields="constructorFields" :items="constructors">
      <template #cell(pos)="{ item, value }">
        <span :class="item.pos <= 3 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>

      <template #cell(team)="{ item, value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[6px] w-[6px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(item.teamId) }"
          ></span>
          <span class="text-[13px] font-semibold text-[#F4F4F2]">{{
            value
          }}</span>
        </div>
      </template>

      <template #cell(drivers)="{ value }">
        <span class="truncate text-[12px] text-[#9C9CA1]">{{
          value.join(' · ')
        }}</span>
      </template>

      <template #cell(pts)="{ item, value }">
        <span :class="item.pos <= 10 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>
    </Table>
  </section>
</template>
