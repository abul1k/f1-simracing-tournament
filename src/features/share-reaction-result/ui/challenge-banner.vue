<script setup lang="ts">
import { useChallenge } from '../model'

const challenge = useChallenge()
</script>

<template>
  <div
    v-if="challenge !== null"
    class="flex w-full items-center gap-3 rounded-[2px] border border-[#26262B] border-l-2 border-l-racing-red bg-[#131316] px-5 py-3.5"
  >
    <svg
      class="h-[18px] w-[18px] shrink-0 text-racing-red"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.33 2q2 0 3.67-1.2a1 1 0 0 1 1.6.8v9a1 1 0 0 1-.4.8A6 6 0 0 1 16 14c-3 0-5-2-8-2a6 6 0 0 0-4 1.53" />
    </svg>
    <p class="text-[14px] font-medium text-[#8A8A93]">
      A friend set
      <span class="font-mono font-bold text-white">{{ challenge }} ms</span>
      — can you beat it?
    </p>
  </div>
</template>
