<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { teamColor } from '@/shared/config/teams'
import { getFlag } from '@/shared/utils/getFlag'
import {
  buildConstructorStandings,
  defaultDriverStandings,
  isRetired,
  roundCount,
  type DriverStanding,
  type RoundResult,
} from '../model'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    standings?: DriverStanding[]
  }>(),
  {
    eyebrow: 'SEASON 1',
    title: 'Championship Standings',
    standings: () => defaultDriverStandings,
  },
)

const tab = ref<'drivers' | 'constructors'>('drivers')

const rounds = computed(() => roundCount(props.standings))

const roundFields = computed<TableField[]>(() =>
  Array.from({ length: rounds.value }, (_, index) => ({
    key: `results.${index}`,
    label: `R${index + 1}`,
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

const constructors = computed(() => buildConstructorStandings(props.standings))

const tableWidth = computed(() => `${584 + rounds.value * 56}px`)

const resultClass = (value: RoundResult, pos: number) => {
  if (isRetired(value)) return 'font-semibold text-[#C13B33]'

  return pos <= 10 ? 'text-[#9C9CA1]' : 'text-[#68686D]'
}
</script>

<template>
  <section class="flex w-full flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <p class="text-[12px] font-bold tracking-[1.2px] text-[#C13B33]">
        {{ props.eyebrow }}
      </p>
      <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">
        {{ props.title }}
      </h1>
    </div>

    <div class="flex gap-2">
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

    <Table
      v-if="tab === 'drivers'"
      :fields="driverFields"
      :items="props.standings"
      row-key="driver"
      :min-width="tableWidth"
    >
      <template #cell(pos)="{ item, value }">
        <span :class="item.pos <= 3 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>

      <template #cell(team)="{ value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[6px] w-[6px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(value) }"
          ></span>
          <span class="truncate text-[12px] text-[#9C9CA1]">{{ value }}</span>
        </div>
      </template>

      <template
        v-for="(field, index) in roundFields"
        :key="field.key"
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

      <template #cell(team)="{ value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[6px] w-[6px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(value) }"
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
