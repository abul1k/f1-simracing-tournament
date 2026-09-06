<script setup lang="ts">
import Button from '@/shared/ui/button/index.vue'

const links = [
  { label: 'Championship', to: '/' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Standings', to: '/standings' },
  { label: 'Drivers', to: '/drivers' },
  { label: 'Teams', to: '/teams' },
  { label: 'Results', to: '/results' },
  { label: 'Statistics', to: '/statistics' },
  { label: 'Regulations', to: '/regulations' },
]
</script>

<template>
  <nav
    class="sticky top-0 z-50 h-16 w-full border-b border-[#2A2A2E] bg-[#141416] px-8"
  >
    <div class="mx-auto flex h-full max-w-360 items-center justify-between">
      <div class="flex items-center gap-10">
        <router-link to="/" class="flex items-center gap-2">
          <span class="h-4 w-2.5 bg-[#C13B33]"></span>
          <span
            class="text-[16px] font-extrabold tracking-[0.5px] whitespace-nowrap text-[#F4F4F2]"
          >
            F1 UZBEKISTAN
          </span>
        </router-link>

        <ul class="hidden items-center gap-7 lg:flex">
          <li v-for="link in links" :key="link.to">
            <router-link
              :to="link.to"
              :active-class="'text-[#F4F4F2] font-bold'"
              class="text-[14px] font-medium whitespace-nowrap text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="flex items-center gap-5">
        <button
          type="button"
          aria-label="Search"
          class="text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
        >
          <svg
            class="h-4 w-4"
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
        </button>

        <button
          type="button"
          class="flex items-center gap-1 text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
        >
          <span class="text-[13px] font-semibold whitespace-nowrap">EN</span>
          <svg
            class="h-3 w-3 text-[#68686D]"
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
        </button>

        <Button variant="outlined" size="sm">LOG IN</Button>
      </div>
    </div>
  </nav>
</template>
