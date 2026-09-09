<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { teamColor } from '@/entities/team/lib'
import { getFlag } from '@/shared/utils/getFlag'
import {
  formatRoundDate,
  podiumLabels,
  todayISO,
  useCalendarRounds,
  type CalendarRound,
} from '../model'

withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
  }>(),
  {
    eyebrow: 'SEASON 1',
    title: 'Race Calendar',
  },
)

const rounds = useCalendarRounds()

const nextRound = computed(() => {
  const today = todayISO()

  return rounds.value.find((item) => item.date >= today)?.round
})

const isNext = (item: CalendarRound) => item.round === nextRound.value

const hasResults = (item: CalendarRound) => Boolean(item.podium?.length)
</script>

<template>
  <section class="flex w-full flex-col gap-7">
    <div class="flex flex-col gap-1.5">
      <p class="text-[12px] font-bold tracking-[1.2px] text-racing-red">{{ eyebrow }}</p>
      <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">{{ title }}</h1>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <component
        :is="hasResults(item) ? RouterLink : 'div'"
        v-for="item in rounds"
        :key="item.round"
        :to="
          hasResults(item)
            ? { name: 'calendar-schedule', params: { round: item.round } }
            : undefined
        "
        class="flex h-[250px] flex-col justify-between overflow-hidden rounded-[2px] border p-6 text-left transition-colors"
        :class="[
          isNext(item)
            ? 'border-[#1657C8] bg-[#1657C8]'
            : 'border-[#2A2A2E] bg-[#141416]',
          hasResults(item) ? 'cursor-pointer hover:border-[#38383C]' : 'cursor-default',
        ]"
      >
        <div class="flex w-full flex-col gap-3.5">
          <div class="flex w-full items-center justify-between">
            <span
              class="font-mono text-[12px] font-bold tracking-[0.5px]"
              :class="isNext(item) ? 'text-white/70' : 'text-[#68686D]'"
            >
              ROUND {{ item.round }}
            </span>

            <span
              class="flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.25"
              :class="isNext(item) ? 'bg-white/15' : 'bg-[#232326]'"
            >
              <svg
                class="h-3 w-3 shrink-0"
                :class="isNext(item) ? 'text-white/70' : 'text-[#68686D]'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" x2="4" y1="22" y2="15" />
              </svg>
              <span
                class="font-mono text-[11px] font-bold tracking-[0.3px] whitespace-nowrap"
                :class="isNext(item) ? 'text-white' : 'text-[#9C9CA1]'"
              >
                {{ formatRoundDate(item.date) }}
              </span>
            </span>
          </div>

          <div class="flex w-full items-center gap-2.5">
            <img
              v-if="getFlag(item.country)"
              :src="getFlag(item.country)"
              :alt="item.country"
              class="h-5 w-auto shrink-0 rounded-[1px]"
            />
            <span v-else class="text-[22px]">{{ item.flag }}</span>
            <span
              class="text-[21px] font-extrabold"
              :class="isNext(item) ? 'text-white' : 'text-[#F4F4F2]'"
            >
              {{ item.country }}
            </span>
          </div>

          <p
            class="w-full text-[12px]/[16px] font-semibold tracking-[0.2px]"
            :class="isNext(item) ? 'text-white/80' : 'text-[#9C9CA1]'"
          >
            {{ item.type }}
          </p>
        </div>

        <div
          class="flex w-full flex-col rounded-[2px] border"
          :class="isNext(item) ? 'border-white/20 bg-white/10' : 'border-[#2A2A2E] bg-[#1B1B1E]'"
        >
          <div
            v-for="(label, index) in podiumLabels"
            :key="label"
            class="flex w-full items-center gap-2 px-3 py-1.75"
            :class="[
              index > 0 && 'border-t',
              isNext(item) ? 'border-white/20' : 'border-[#2A2A2E]',
            ]"
          >
            <span
              class="w-[30px] shrink-0 font-mono text-[10px] font-bold"
              :class="isNext(item) ? 'text-white/70' : 'text-[#68686D]'"
            >
              {{ label }}
            </span>

            <span
              class="h-[18px] w-[18px] shrink-0 rounded-full"
              :style="{
                backgroundColor: item.podium?.[index]
                  ? teamColor(item.podium[index].teamId)
                  : 'transparent',
              }"
              :class="!item.podium?.[index] && 'border border-dashed border-white/30'"
            ></span>

            <span
              class="flex-1 text-[12px] font-bold"
              :class="isNext(item) ? 'text-white' : 'text-[#F4F4F2]'"
            >
              {{ item.podium?.[index]?.code ?? '—' }}
            </span>

            <span
              class="w-[92px] shrink-0 text-right font-mono text-[11px] font-medium"
              :class="isNext(item) ? 'text-white/80' : 'text-[#9C9CA1]'"
            >
              {{ item.podium?.[index]?.time ?? '—' }}
            </span>
          </div>
        </div>
      </component>
    </div>
  </section>
</template>
