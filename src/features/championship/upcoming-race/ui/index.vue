<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import Badge from '@/shared/ui/badge/index.vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { getFlag } from '@/shared/utils/getFlag'
import {
  defaultLastResult,
  defaultNextRace,
  type LastResult,
  type NextRace,
} from '../model'

const props = withDefaults(
  defineProps<{
    nextRace?: NextRace
    lastResult?: LastResult
  }>(),
  {
    nextRace: () => defaultNextRace,
    lastResult: () => defaultLastResult,
  },
)

defineEmits<{
  viewRace: []
  viewFullResult: []
}>()

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
let timer: ReturnType<typeof setInterval> | undefined

const pad = (n: number) => String(n).padStart(2, '0')

const countdown = computed(() => {
  if (!props.nextRace.startsAt) return props.nextRace.countdown

  const diff = new Date(props.nextRace.startsAt).getTime() - now.value
  if (diff <= 0) return 'LIVE NOW'

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor(diff / 3_600_000) % 24
  const minutes = Math.floor(diff / 60_000) % 60

  return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M`
})

if (props.nextRace.startsAt) {
  timer = setInterval(() => (now.value = Date.now()), 30_000)
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="flex w-full flex-col items-start gap-5 lg:flex-row">
    <div
      class="flex w-full flex-col items-start gap-5 border border-[#2A2A2E] bg-[#141416] p-7 lg:flex-1"
    >
      <div class="flex w-full items-center justify-between">
        <span class="text-[12px] font-bold tracking-[1px] text-[#68686D]">
          {{ props.nextRace.round }}
        </span>
        <Badge variant="gray" size="sm" :dot="false">
          {{ props.nextRace.status }}
        </Badge>
      </div>

      <div class="flex items-center gap-3">
        <img
          v-if="getFlag(props.nextRace.country)"
          :src="getFlag(props.nextRace.country)"
          :alt="props.nextRace.country"
          class="h-6 w-auto shrink-0 rounded-[1px]"
        />
        <span v-else class="text-[24px]">{{ props.nextRace.flag }}</span>
        <div class="flex flex-col gap-0.5">
          <h2 class="text-[22px] font-extrabold text-[#F4F4F2]">
            {{ props.nextRace.name }}
          </h2>
          <p class="text-[13px] text-[#9C9CA1]">{{ props.nextRace.circuit }}</p>
        </div>
      </div>

      <div class="h-px w-full bg-[#2A2A2E]"></div>

      <div class="flex flex-wrap gap-8">
        <div
          v-for="session in props.nextRace.sessions"
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
          RACE WEEKEND STARTS IN
        </span>
        <span class="font-mono text-[28px] font-semibold text-[#C13B33]">
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

      <div class="flex items-center gap-2.5">
        <img
          v-if="getFlag(props.lastResult.country)"
          :src="getFlag(props.lastResult.country)"
          :alt="props.lastResult.country"
          class="h-4.5 w-auto shrink-0 rounded-[1px]"
        />
        <span v-else class="text-[18px]">{{ props.lastResult.flag }}</span>
        <h2 class="text-[15px] font-bold text-[#F4F4F2]">
          {{ props.lastResult.title }}
        </h2>
      </div>

      <Table
        :fields="resultFields"
        :items="props.lastResult.results"
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
    </div>
  </section>
</template>
