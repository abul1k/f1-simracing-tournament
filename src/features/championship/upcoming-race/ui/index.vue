<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import Badge from '@/shared/ui/badge/index.vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { getFlag } from '@/shared/utils/getFlag'
import { useLastResult, useNextRace } from '../model'

defineEmits<{
  viewRace: []
  viewFullResult: []
}>()

const nextRace = useNextRace()
const lastResult = useLastResult()

const resultFields: TableField[] = [
  {
    key: 'pos',
    width: '20px',
    class: 'font-mono text-[14px] font-semibold text-[#68686D]',
  },
  { key: 'name', class: 'text-[14px] font-semibold text-[#F4F4F2]' },
  {
    key: 'team',
    width: '120px',
    align: 'right',
    class: 'text-[12px] font-normal text-[#9C9CA1]',
  },
]

const now = ref(Date.now())

const pad = (n: number) => String(n).padStart(2, '0')

/** Milliseconds until the weekend's first qualifying session, null if unknown. */
const msUntilStart = computed(() => {
  const startsAt = nextRace.value?.startsAt

  if (!startsAt) return null

  return new Date(startsAt).getTime() - now.value
})

/** True from the moment the first qualifying session is due to begin. */
const isLive = computed(() => msUntilStart.value !== null && msUntilStart.value <= 0)

const countdown = computed(() => {
  const diff = msUntilStart.value

  if (diff === null) return nextRace.value?.countdown ?? ''

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor(diff / 3_600_000) % 24
  const minutes = Math.floor(diff / 60_000) % 60
  const seconds = Math.floor(diff / 1_000) % 60

  return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
})

// Ticks every second, so the flip to LIVE NOW happens on the minute it is due
// rather than up to half a minute late.
const timer = setInterval(() => (now.value = Date.now()), 1_000)

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="flex w-full flex-col items-start gap-5 lg:flex-row">
    <div
      v-if="nextRace"
      class="flex w-full flex-col items-start gap-5 border border-[#2A2A2E] bg-[#141416] p-7 lg:flex-1"
    >
      <div class="flex w-full items-center justify-between">
        <span class="text-[12px] font-bold tracking-[1px] text-[#68686D]">
          {{ nextRace.round }}
        </span>
        <Badge variant="gray" size="sm" :dot="false">
          {{ nextRace.status }}
        </Badge>
      </div>

      <div class="flex items-center gap-3">
        <img
          v-if="getFlag(nextRace.country)"
          :src="getFlag(nextRace.country)"
          :alt="nextRace.country"
          class="h-6 w-auto shrink-0 rounded-[1px]"
        />
        <div class="flex flex-col gap-0.5">
          <h2 class="text-[22px] font-extrabold text-[#F4F4F2]">
            {{ nextRace.name }}
          </h2>
          <p class="text-[13px] text-[#9C9CA1]">{{ nextRace.circuit }}</p>
        </div>
      </div>

      <div class="h-px w-full bg-[#2A2A2E]"></div>

      <div class="flex flex-wrap gap-8">
        <div
          v-for="session in nextRace.sessions"
          :key="session.label"
          class="flex flex-col gap-1"
        >
          <span class="text-[11px] font-bold tracking-[0.8px] text-[#68686D]">
            {{ session.label }}
          </span>
          <span class="text-[15px] font-semibold text-[#F4F4F2]">
            {{ session.value }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-[11px] font-bold tracking-[0.8px] text-[#68686D]">
          {{ isLive ? 'RACE WEEKEND' : `${nextRace.startsLabel} STARTS IN` }}
        </span>

        <span
          v-if="isLive"
          class="flex items-center gap-2.5 font-mono text-[28px] font-semibold text-[#3FA35C]"
        >
          <span
            class="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#3FA35C] motion-reduce:animate-none"
          ></span>
          LIVE NOW
        </span>

        <span
          v-else
          class="font-mono text-[22px] font-semibold text-[#C13B33] sm:text-[28px]"
        >
          {{ countdown }}
        </span>
      </div>

      <Button variant="filled" size="lg" full @click="$emit('viewRace')">
        VIEW RACE
      </Button>
    </div>

    <div
      class="flex w-full shrink-0 flex-col items-start gap-4.5 border border-[#2A2A2E] bg-[#141416] p-7 lg:w-115"
    >
      <span class="text-[12px] font-bold tracking-[1px] text-[#68686D]">
        LAST RESULT
      </span>

      <template v-if="lastResult">
        <div class="flex items-center gap-2.5">
          <img
            v-if="getFlag(lastResult.country)"
            :src="getFlag(lastResult.country)"
            :alt="lastResult.country"
            class="h-4.5 w-auto shrink-0 rounded-[1px]"
          />
          <h2 class="text-[15px] font-bold text-[#F4F4F2]">
            {{ lastResult.title }}
          </h2>
        </div>

        <Table
          :fields="resultFields"
          :items="lastResult.results"
          row-key="name"
          min-width="0"
          row-padding="px-0 py-2.5"
          :bordered="false"
          :hover="false"
          hide-head
          class="w-full"
        />

        <Button variant="outlined" size="lg" full @click="$emit('viewFullResult')">
          VIEW FULL RESULT
        </Button>
      </template>

      <p v-else class="py-4 text-[13px] text-[#68686D]">
        No races completed yet — results appear here once a round is finished.
      </p>
    </div>
  </section>
</template>
