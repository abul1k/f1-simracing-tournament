<script setup lang="ts">
import { useGradeRows } from '../model'

const rows = useGradeRows()
</script>

<template>
  <section class="flex w-full flex-col gap-11">
    <div class="flex flex-col gap-4">
      <p class="text-[12px] font-extrabold tracking-[2.2px] text-racing-red">
        HOW YOUR SCORE GRADES
      </p>

      <div
        class="flex w-full flex-col rounded-[2px] border border-[#26262B] bg-[#131316]"
      >
        <div
          v-for="(row, index) in rows"
          :key="row.key"
          class="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2.5 px-4 py-[18px] sm:px-6 lg:grid-cols-[150px_110px_1fr_250px]"
          :class="[
            row.yours && 'bg-[#17171C]',
            index < rows.length - 1 && 'border-b border-[#26262B]',
          ]"
        >
          <span
            class="text-[15px] font-extrabold"
            :style="{ color: row.yours ? row.color : '#FFFFFF' }"
          >
            {{ row.name }}
          </span>
          <span
            class="text-right font-mono text-[13px] font-medium text-[#8A8A93] lg:text-left"
          >
            {{ row.range }}
          </span>
          <div class="col-span-2 h-2 rounded-[1px] bg-[#1B1B20] lg:col-span-1">
            <div
              class="h-2 rounded-[1px]"
              :style="{ width: `${row.bar}%`, backgroundColor: row.color }"
            ></div>
          </div>
          <span
            class="col-span-2 text-[11px] font-medium lg:col-span-1 lg:text-right"
            :class="row.yours ? 'text-white' : 'text-[#5A5A63]'"
          >
            {{ row.note }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex w-full gap-4 rounded-[2px] border border-[#26262B] bg-[#0E0E11] p-6"
    >
      <svg
        class="h-5 w-5 shrink-0 text-racing-red"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <div class="flex flex-1 flex-col gap-[7px]">
        <p class="text-[14px] font-bold text-white">About accuracy</p>
        <p class="text-[13px] leading-[21px] font-medium text-[#8A8A93]">
          Monitors, mice and browsers add roughly 20–50 ms of latency on top of
          you. Treat the number as a fair benchmark between friends, not a lab
          measurement.
        </p>
      </div>
    </div>
  </section>
</template>
