<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/shared/ui/button/index.vue'
import Table from '@/shared/ui/table/index.vue'
import type { TableField } from '@/shared/ui/table/types'
import { teamColor, teamGradient } from '@/entities/team/lib'
import { getFlag } from '@/shared/utils/getFlag'
import {
  ordinals,
  podiumHeights,
  previewCount,
  splitName,
  useChampionshipStandings,
} from '../model'

const props = withDefaults(
  defineProps<{
    title?: string
    previewCount?: number
  }>(),
  {
    title: 'CHAMPIONSHIP STANDINGS',
    previewCount,
  },
)

const standings = useChampionshipStandings()

defineEmits<{
  viewFull: []
}>()

const fields: TableField[] = [
  {
    key: 'pos',
    label: 'POS',
    width: '48px',
    class: 'font-mono text-[14px] font-bold',
  },
  {
    key: 'driver',
    label: 'DRIVER',
    class: 'text-[14px] font-semibold text-[#F4F4F2]',
  },
  { key: 'team', label: 'TEAM', width: '180px' },
  {
    key: 'pts',
    label: 'PTS',
    width: '80px',
    class: 'font-mono text-[14px] font-bold text-[#F4F4F2]',
  },
]

const podium = computed(() =>
  [standings.value[1], standings.value[0], standings.value[2]].filter(Boolean),
)

const expanded = ref(false)

const visible = computed(() =>
  expanded.value
    ? standings.value
    : standings.value.slice(0, props.previewCount),
)

const expandable = computed(() => standings.value.length > props.previewCount)
</script>

<template>
  <section class="flex w-full flex-col">
    <div class="flex items-center justify-between pb-4">
      <h2 class="text-[18px] font-extrabold text-[#F4F4F2]">
        {{ props.title }}
      </h2>

      <router-link
        to="/standings"
        type="button"
        class="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] text-racing-red transition-opacity hover:opacity-75"
        @click="$emit('viewFull')"
      >
        FULL STANDINGS
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
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </router-link>
    </div>

    <div
      class="flex flex-col items-stretch gap-5 pb-5 md:flex-row md:items-end"
    >
      <router-link
        v-for="driver in podium"
        :to="`/drivers/${driver.driver.toLowerCase().replace(' ', '-')}`"
        :key="driver.driver"
        class="flex flex-1 items-end overflow-hidden rounded-[3px] cursor-pointer"
        :class="driver.pos === 1 && 'order-first md:order-none'"
        :style="{
          height: podiumHeights[driver.pos],
          backgroundImage: teamGradient(driver.teamId),
        }"
      >
        <div
          class="flex h-full flex-1 flex-col justify-between pt-4 pr-3 pb-4.5 pl-4.5"
        >
          <div class="flex flex-col gap-[7px]">
            <div class="flex items-start gap-[3px] text-white">
              <span class="text-[34px]/[34px] font-extrabold">{{
                driver.pos
              }}</span>
              <span
                class="pt-[5px] text-[11px] font-extrabold tracking-[0.5px]"
              >
                {{ ordinals[driver.pos] }}
              </span>
            </div>

            <div class="flex items-end gap-1 text-[19px] text-white">
              <span v-if="splitName(driver.driver).first" class="font-normal">
                {{ splitName(driver.driver).first }}
              </span>
              <span class="font-extrabold">{{
                splitName(driver.driver).last
              }}</span>
            </div>

            <span class="text-[12px] font-medium text-white/80">{{
              driver.team
            }}</span>

            <div class="pt-1.5">
              <img
                v-if="getFlag(driver.country)"
                :src="getFlag(driver.country)"
                :alt="driver.country"
                class="h-6 w-6 rounded-full border border-white/35 object-cover"
              />
            </div>
          </div>

          <div class="flex items-end gap-[5px] text-white">
            <span class="text-[21px] font-extrabold">{{ driver.pts }}</span>
            <span class="text-[10px] font-bold tracking-[0.5px] text-white/70"
              >PTS</span
            >
          </div>
        </div>
      </router-link>
    </div>

    <Table
      :fields="fields"
      :items="visible"
      row-key="driver"
      row-padding="px-5 py-3.25"
    >
      <template #cell(pos)="{ item, value }">
        <span :class="item.pos <= 3 ? 'text-[#F4F4F2]' : 'text-[#9C9CA1]'">{{
          value
        }}</span>
      </template>

      <template #cell(team)="{ item, value }">
        <div class="flex items-center gap-2">
          <span
            class="h-[7px] w-[7px] shrink-0 rounded-full"
            :style="{ backgroundColor: teamColor(item.teamId) }"
          ></span>
          <span class="truncate text-[13px] text-[#9C9CA1]">{{ value }}</span>
        </div>
      </template>
    </Table>

    <Button
      v-if="expandable"
      variant="outlined"
      size="lg"
      full
      class="mt-4"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'SHOW LESS' : `SHOW ALL ${standings.length} DRIVERS` }}
    </Button>
  </section>
</template>
