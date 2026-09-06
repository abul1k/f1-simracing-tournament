<script setup lang="ts">
const links = [
  { label: 'Championship', to: '/championship' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Results', to: '/results' },
  { label: 'Standings', to: '/standings' },
  { label: 'Drivers', to: '/drivers' },
  { label: 'Teams', to: '/teams' },
  { label: 'Regulations', to: '/regulations' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="w-full border-t border-[#2A2A2E] bg-[#0A0A0B] px-8 py-7">
    <div class="mx-auto flex max-w-360 flex-col gap-4">
      <div
        class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-0"
      >
        <div class="flex flex-col gap-1">
          <span
            class="text-[14px] font-extrabold whitespace-nowrap text-[#F4F4F2]"
          >
            F1 UZBEKISTAN
          </span>
          <span class="text-[12px] font-normal text-[#68686D]">
            F1 2020 Community Championship
          </span>
        </div>

        <ul class="flex flex-wrap items-start gap-x-7 gap-y-2">
          <li v-for="link in links" :key="link.to">
            <a
              :href="link.to"
              class="text-[12px] font-medium whitespace-nowrap text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <div class="h-px w-full bg-[#2A2A2E]"></div>

      <p class="text-[11px] font-normal text-[#68686D]">
        © {{ year }} F1 UZBEKISTAN. All rights reserved.
      </p>
    </div>
  </footer>
</template>
