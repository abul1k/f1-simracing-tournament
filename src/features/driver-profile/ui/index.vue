<script setup lang="ts">
import { computed } from 'vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { teamColor } from '@/entities/team/lib'
import { countryName } from '@/shared/config/countries'
import { getFlag } from '@/shared/utils/getFlag'
import {
  positionHeight,
  useDriverHistory,
  useDriverStats,
  valueHeight,
  type ProfileHeader,
} from '../model'

const props = withDefaults(
  defineProps<{
    driver?: ProfileHeader
    season?: string
  }>(),
  {
    season: 'Season 1',
  },
)

const driverId = computed(() => props.driver?.id)

const history = useDriverHistory(driverId)
const stats = useDriverStats(driverId, history)

const statCards = computed(() => [
  { label: 'RACES', value: stats.value.races },
  { label: 'WINS', value: stats.value.wins },
  { label: 'PODIUMS', value: stats.value.podiums },
  { label: 'POLES', value: stats.value.poles },
  { label: 'FASTEST LAPS', value: stats.value.fastestLaps },
  { label: 'DNFS', value: stats.value.dnfs },
  { label: 'AVERAGE FINISH', value: stats.value.averageFinish },
])

const maxPoints = computed(() =>
  history.value.reduce((max, entry) => Math.max(max, entry.cumulative), 0),
)

const historyFields: TableField[] = [
  {
    key: 'label',
    label: 'ROUND',
    width: '80px',
    class: 'font-mono text-[13px] font-bold text-[#9C9CA1]',
  },
  { key: 'circuit', label: 'CIRCUIT', class: 'text-[13px] text-[#F4F4F2]' },
  { key: 'team', label: 'TEAM', width: '170px' },
  { key: 'qualifying', label: 'QUALIFYING', width: '120px' },
  { key: 'finish', label: 'FINISH', width: '100px' },
  {
    key: 'points',
    label: 'POINTS',
    width: '80px',
    class: 'font-mono text-[13px] font-bold text-[#F4F4F2]',
  },
]

const positionLabel = (value: number | string | null) =>
  typeof value === 'number' ? `P${value}` : (value ?? '—')
</script>

<template>
  <section v-if="props.driver" class="flex w-full flex-col gap-4">
    <RouterLink
      :to="{ name: 'drivers' }"
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
      DRIVERS
    </RouterLink>

    <header
      class="mt-2 flex flex-col gap-6 border-l-4 bg-[#141416] px-8 py-7 lg:flex-row lg:items-center lg:justify-between"
      :style="{ borderColor: teamColor(props.driver.teamId) }"
    >
      <div class="flex items-center gap-5">
        <span class="font-mono text-[22px] font-bold text-[#68686D]">
          #{{ props.driver.number }}
        </span>
        <span class="h-11 w-px shrink-0 bg-[#2A2A2E]"></span>

        <div class="flex flex-col gap-1.5">
          <h1 class="text-[28px] font-extrabold text-[#F4F4F2] uppercase">
            {{ props.driver.name }}
          </h1>

          <div class="flex flex-wrap items-center gap-2 text-[13px]">
            <img
              v-if="getFlag(props.driver.nationality)"
              :src="getFlag(props.driver.nationality)"
              :alt="props.driver.nationality"
              class="h-3.5 w-auto shrink-0 rounded-[1px]"
            />
            <span class="text-[#9C9CA1]">
              {{ countryName(props.driver.nationality) }}
            </span>
            <span class="text-[#68686D]">·</span>
            <span class="flex items-center gap-1.5">
              <span
                class="h-[6px] w-[6px] shrink-0 rounded-full"
                :style="{ backgroundColor: teamColor(props.driver.teamId) }"
              ></span>
              <span class="font-semibold text-[#9C9CA1]">{{ props.driver.team }}</span>
            </span>
            <span class="text-[#68686D]">·</span>
            <span class="text-[#9C9CA1]">{{ props.season }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start gap-0.5 lg:items-end">
        <span class="text-[10px] font-bold tracking-[0.6px] text-[#68686D]">
          CHAMPIONSHIP POSITION
        </span>
        <div class="flex items-end gap-3">
          <span class="font-mono text-[34px] font-extrabold text-racing-red">
            P{{ props.driver.pos }}
          </span>
          <span class="pb-1.5 text-[14px] font-bold text-[#F4F4F2]">
            {{ props.driver.pts }} POINTS
          </span>
        </div>
      </div>
    </header>

    <div class="mt-4 flex flex-col gap-3">
      <h2 class="text-[16px] font-extrabold text-[#F4F4F2]">CAREER STATISTICS</h2>

      <div
        class="flex flex-col border border-[#2A2A2E] bg-[#141416] sm:flex-row sm:flex-wrap"
      >
        <div
          v-for="(stat, index) in statCards"
          :key="stat.label"
          class="flex flex-1 flex-col gap-1.5 px-4.5 py-5"
          :class="index > 0 && 'border-t border-[#2A2A2E] sm:border-t-0 sm:border-l'"
        >
          <span class="font-mono text-[24px] font-bold whitespace-nowrap text-[#F4F4F2]">
            {{ stat.value }}
          </span>
          <span class="text-[10px] font-bold tracking-[0.5px] whitespace-nowrap text-[#68686D]">
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-3">
      <h2 class="text-[16px] font-extrabold text-[#F4F4F2]">PERFORMANCE</h2>

      <div class="flex flex-col gap-4 xl:flex-row">
        <div
          class="flex flex-1 flex-col gap-4 border border-[#2A2A2E] bg-[#141416] p-5"
        >
          <h3 class="text-[12px] font-bold tracking-[0.4px] text-[#9C9CA1]">
            FINISHING POSITION BY ROUND
          </h3>

          <div class="flex h-[160px] items-end justify-between gap-2">
            <div
              v-for="entry in history"
              :key="entry.round"
              class="flex h-[160px] flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span class="font-mono text-[12px] font-bold text-[#F4F4F2]">
                {{ positionLabel(entry.finish) }}
              </span>
              <div
                class="w-[26px] bg-racing-red"
                :style="{ height: `${positionHeight(entry.finish)}px` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-between">
            <span
              v-for="entry in history"
              :key="entry.round"
              class="flex-1 text-center text-[11px] font-semibold text-[#68686D]"
            >
              {{ entry.label }}
            </span>
          </div>
        </div>

        <div
          class="flex flex-1 flex-col gap-4 border border-[#2A2A2E] bg-[#141416] p-5"
        >
          <h3 class="text-[12px] font-bold tracking-[0.4px] text-[#9C9CA1]">
            POINTS ACCUMULATED
          </h3>

          <div class="flex h-[160px] items-end justify-between gap-2">
            <div
              v-for="entry in history"
              :key="entry.round"
              class="flex h-[160px] flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span class="font-mono text-[12px] font-bold text-[#F4F4F2]">
                {{ entry.cumulative }}
              </span>
              <div
                class="w-[26px] bg-[#4C8DC1]"
                :style="{ height: `${valueHeight(entry.cumulative, maxPoints)}px` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-between">
            <span
              v-for="entry in history"
              :key="entry.round"
              class="flex-1 text-center text-[11px] font-semibold text-[#68686D]"
            >
              {{ entry.label }}
            </span>
          </div>
        </div>

        <div
          class="flex flex-1 flex-col gap-3.5 border border-[#2A2A2E] bg-[#141416] p-5"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-[12px] font-bold tracking-[0.4px] text-[#9C9CA1]">
              QUALIFYING VS RACE POSITION
            </h3>
            <div class="flex gap-3">
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 bg-[#68686D]"></span>
                <span class="text-[10px] font-bold text-[#68686D]">QUALI</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 bg-racing-red"></span>
                <span class="text-[10px] font-bold text-[#68686D]">RACE</span>
              </span>
            </div>
          </div>

          <div class="flex h-[160px] items-end justify-between gap-2">
            <div
              v-for="entry in history"
              :key="entry.round"
              class="flex h-[160px] flex-1 items-end justify-center gap-1"
            >
              <div
                class="w-4 bg-[#68686D]"
                :style="{ height: `${positionHeight(entry.qualifying)}px` }"
              ></div>
              <div
                class="w-4 bg-racing-red"
                :style="{ height: `${positionHeight(entry.finish)}px` }"
              ></div>
            </div>
          </div>

          <div class="flex justify-between">
            <span
              v-for="entry in history"
              :key="entry.round"
              class="flex-1 text-center text-[11px] font-semibold text-[#68686D]"
            >
              {{ entry.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-3">
      <h2 class="text-[16px] font-extrabold text-[#F4F4F2]">RACE HISTORY</h2>

      <Table
        :fields="historyFields"
        :items="history"
        row-key="round"
        min-width="760px"
        row-padding="px-5 py-3"
      >
        <template #cell(team)="{ item, value }">
          <div class="flex items-center gap-2">
            <span
              class="h-[7px] w-[7px] shrink-0 rounded-full"
              :style="{ backgroundColor: teamColor(item.teamId) }"
            ></span>
            <span class="truncate text-[13px] text-[#9C9CA1]">{{ value }}</span>
          </div>
        </template>

        <template #cell(qualifying)="{ value }">
          <span class="font-mono text-[13px] text-[#9C9CA1]">
            {{ positionLabel(value) }}
          </span>
        </template>

        <template #cell(finish)="{ value }">
          <span
            class="font-mono text-[13px] font-bold"
            :class="value === 1 ? 'text-racing-red' : 'text-[#F4F4F2]'"
          >
            {{ positionLabel(value) }}
          </span>
        </template>
      </Table>
    </div>
  </section>

  <section v-else class="flex w-full flex-col gap-4">
    <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">DRIVER NOT FOUND</h1>
    <RouterLink
      :to="{ name: 'drivers' }"
      class="text-[12px] font-bold tracking-[0.5px] text-racing-red"
    >
      BACK TO DRIVERS
    </RouterLink>
  </section>
</template>
