<script setup lang="ts">
import { computed, ref } from 'vue'
import { teamColor, teamInk } from '@/entities/team/lib'
import { getFlag } from '@/shared/utils/getFlag'
import { toSlug } from '@/shared/utils/slug'
import {
  matchesStatus,
  sortKeys,
  sorters,
  statusKeys,
  useDriverCards,
  type SortKey,
  type StatusKey,
} from '../model'

withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
  }>(),
  {
    eyebrow: 'SEASON 1',
    title: 'Drivers',
  },
)

const search = ref('')
const team = ref('ALL')
const sort = ref<SortKey>('POSITION')
const status = ref<StatusKey>('ALL')

const drivers = useDriverCards()

const teams = computed(() => [
  'ALL',
  ...[...new Set(drivers.value.map((driver) => driver.team))].sort(),
])

const visible = computed(() => {
  const query = search.value.trim().toLowerCase()

  return drivers.value
    .filter((driver) => !query || driver.name.toLowerCase().includes(query))
    .filter((driver) => team.value === 'ALL' || driver.team === team.value)
    .filter((driver) => matchesStatus(driver, status.value))
    .sort(sorters[sort.value])
})
</script>

<template>
  <section class="flex w-full flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <p class="text-[12px] font-bold tracking-[1.2px] text-[#C13B33]">
        {{ eyebrow }}
      </p>
      <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">
        {{ title }}
      </h1>
    </div>

    <div
      class="flex w-full flex-col gap-4 border border-[#2A2A2E] bg-[#141416] px-4.5 py-3.5 lg:flex-row lg:items-center lg:justify-between"
    >
      <label class="flex w-full items-center gap-2 lg:w-[280px]">
        <svg
          class="h-[15px] w-[15px] shrink-0 text-[#68686D]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="search"
          type="search"
          placeholder="Search drivers…"
          class="w-full bg-transparent text-[13px] text-[#F4F4F2] outline-none placeholder:text-[#68686D]"
        />
      </label>

      <div class="flex flex-wrap gap-3">
        <div class="relative">
          <select
            v-model="team"
            class="appearance-none border border-[#38383C] py-2 pr-9 pl-3.5 text-[12px] font-semibold text-[#9C9CA1] outline-none"
          >
            <option v-for="option in teams" :key="option" :value="option">
              {{ option === 'ALL' ? 'TEAM' : option.toUpperCase() }}
            </option>
          </select>
          <svg
            class="pointer-events-none absolute top-1/2 right-3 h-[13px] w-[13px] -translate-y-1/2 text-[#68686D]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div class="relative">
          <select
            v-model="sort"
            class="appearance-none border border-[#38383C] py-2 pr-9 pl-3.5 text-[12px] font-semibold text-[#9C9CA1] outline-none"
          >
            <option v-for="option in sortKeys" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <svg
            class="pointer-events-none absolute top-1/2 right-3 h-[13px] w-[13px] -translate-y-1/2 text-[#68686D]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div class="relative">
          <select
            v-model="status"
            class="appearance-none border border-[#38383C] py-2 pr-9 pl-3.5 text-[12px] font-semibold text-[#9C9CA1] outline-none"
          >
            <option v-for="option in statusKeys" :key="option" :value="option">
              {{ option === 'ALL' ? 'STATUS' : option }}
            </option>
          </select>
          <svg
            class="pointer-events-none absolute top-1/2 right-3 h-[13px] w-[13px] -translate-y-1/2 text-[#68686D]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    <div
      v-if="visible.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <RouterLink
        v-for="driver in visible"
        :key="driver.name"
        :to="{
          name: 'driver-profile',
          params: { driver: toSlug(driver.name) },
        }"
        class="flex flex-col gap-3.5 p-5 transition-opacity hover:opacity-90"
        :style="{ backgroundColor: teamColor(driver.teamId) }"
      >
        <div class="flex w-full items-center justify-between">
          <span
            class="font-mono text-[14px] font-bold"
            :style="{ color: teamInk(driver.teamId).soft }"
          >
            #{{ driver.number }}
          </span>
          <img
            v-if="getFlag(driver.nationality)"
            :src="getFlag(driver.nationality)"
            :alt="driver.nationality"
            class="h-[15px] w-auto shrink-0 rounded-[1px]"
          />
        </div>

        <h2
          class="text-[18px] font-extrabold"
          :style="{ color: teamInk(driver.teamId).strong }"
        >
          {{ driver.name }}
        </h2>

        <div class="flex items-center gap-1.5">
          <span
            class="h-[6px] w-[6px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamInk(driver.teamId).strong }"
          ></span>
          <span
            class="text-[12px] whitespace-nowrap"
            :style="{ color: teamInk(driver.teamId).soft }"
          >
            {{ driver.team }}
          </span>
        </div>

        <div
          class="h-px w-full"
          :style="{ backgroundColor: teamInk(driver.teamId).line }"
        ></div>

        <div class="flex w-full justify-between">
          <div
            v-for="stat in [
              { label: 'PTS', value: driver.pts },
              { label: 'WINS', value: driver.wins },
              { label: 'PODIUMS', value: driver.podiums },
            ]"
            :key="stat.label"
            class="flex flex-col gap-0.5"
          >
            <span
              class="font-mono text-[16px] font-bold"
              :style="{ color: teamInk(driver.teamId).strong }"
            >
              {{ stat.value }}
            </span>
            <span
              class="text-[9px] font-bold tracking-[0.5px]"
              :style="{ color: teamInk(driver.teamId).soft }"
            >
              {{ stat.label }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <p v-else class="py-10 text-center text-[13px] text-[#68686D]">
      No drivers match these filters.
    </p>
  </section>
</template>
