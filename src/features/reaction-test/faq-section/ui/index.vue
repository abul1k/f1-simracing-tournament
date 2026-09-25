<script setup lang="ts">
import { ref } from 'vue'
import { faq } from '../model'

/** Index of the open question, or null with all closed. */
const open = ref<number | null>(0)

const toggle = (index: number) => {
  open.value = open.value === index ? null : index
}
</script>

<template>
  <section class="flex w-full flex-col gap-4">
    <p class="text-[12px] font-extrabold tracking-[2.2px] text-racing-red">
      QUESTIONS
    </p>

    <div
      class="flex w-full flex-col rounded-[2px] border border-[#26262B] bg-[#131316]"
    >
      <div
        v-for="(item, index) in faq"
        :key="item.question"
        :class="index < faq.length - 1 && 'border-b border-[#26262B]'"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-[22px] text-left sm:px-6"
          :aria-expanded="open === index"
          @click="toggle(index)"
        >
          <span class="flex-1 text-[15px] font-bold text-white">
            {{ item.question }}
          </span>
          <svg
            class="h-[18px] w-[18px] shrink-0"
            :class="open === index ? 'text-racing-red' : 'text-[#8A8A93]'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path v-if="open !== index" d="M12 5v14" />
          </svg>
        </button>
        <p
          v-if="open === index"
          class="-mt-2 px-4 pb-[22px] text-[13px] leading-[21px] font-medium text-[#8A8A93] sm:px-6"
        >
          {{ item.answer }}
        </p>
      </div>
    </div>
  </section>
</template>
