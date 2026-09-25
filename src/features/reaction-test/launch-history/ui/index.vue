<script setup lang="ts">
import { useLaunchSlots } from '../model'

const slots = useLaunchSlots()
</script>

<template>
  <section class="flex w-full gap-2 sm:gap-3">
    <div
      v-for="slot in slots"
      :key="slot.label"
      class="flex flex-1 flex-col rounded-[2px] border border-[#26262B] bg-[#131316]"
    >
      <span
        class="h-[2px] w-full"
        :class="slot.current ? 'bg-racing-red' : 'bg-transparent'"
      ></span>
      <div class="flex flex-col items-center gap-[7px] px-2 py-4 sm:px-3">
        <span
          class="font-mono text-[17px] font-bold sm:text-[22px]"
          :class="
            slot.value === null
              ? 'text-[#5A5A63]'
              : slot.best
                ? 'text-[#B24BD0]'
                : 'text-white'
          "
        >
          {{ slot.value ?? '—' }}
        </span>
        <span
          class="text-[10px] font-bold tracking-[1.4px]"
          :class="slot.current ? 'text-white' : 'text-[#8A8A93]'"
        >
          {{ slot.label }}
        </span>
      </div>
    </div>
  </section>
</template>
