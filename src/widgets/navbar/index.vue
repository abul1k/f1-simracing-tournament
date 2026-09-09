<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

watch(() => route.fullPath, closeMenu)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <nav
    class="sticky top-0 z-50 h-16 w-full border-b border-[#2A2A2E] bg-[#141416] px-4 lg:px-8"
  >
    <div class="mx-auto flex h-full max-w-360 items-center justify-between">
      <div class="flex items-center gap-10">
        <router-link to="/" class="flex items-center gap-2">
          <span class="h-4 w-2.5 bg-racing-red"></span>
          <span
            class="text-[16px] font-extrabold tracking-[0.5px] whitespace-nowrap text-[#F4F4F2]"
          >
            RACEFOR.FUN
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
          class="hidden items-center gap-1 text-[#9C9CA1] transition-colors hover:text-[#F4F4F2] lg:flex"
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

        <div class="hidden lg:block">
          <Button variant="outlined" size="sm">LOG IN</Button>
        </div>

        <button
          type="button"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          class="flex h-8 w-8 items-center justify-center text-[#F4F4F2] transition-colors hover:text-racing-red lg:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <template v-if="isMenuOpen">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </template>
            <template v-else>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </template>
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden="true"
          @click="closeMenu"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-200 ease-out"
        leave-active-class="transition-transform duration-200 ease-in"
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
      >
        <aside
          v-if="isMenuOpen"
          id="mobile-menu"
          class="fixed top-0 right-0 z-50 flex h-dvh w-70 max-w-[85vw] flex-col border-l border-[#2A2A2E] bg-[#141416] lg:hidden"
        >
          <div
            class="flex h-16 shrink-0 items-center justify-between border-b border-[#2A2A2E] px-5"
          >
            <span
              class="text-[13px] font-extrabold tracking-[1px] text-[#68686D]"
            >
              MENU
            </span>

            <button
              type="button"
              aria-label="Close menu"
              class="flex h-8 w-8 items-center justify-center text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
              @click="closeMenu"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <ul class="flex-1 overflow-y-auto py-2">
            <li v-for="link in links" :key="link.to">
              <router-link
                :to="link.to"
                :active-class="'text-[#F4F4F2] font-bold border-l-racing-red'"
                class="block border-l-2 border-l-transparent px-5 py-3.5 text-[15px] font-medium text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
                @click="closeMenu"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>

          <div
            class="flex shrink-0 items-center justify-between gap-4 border-t border-[#2A2A2E] px-5 py-4"
          >
            <button
              type="button"
              class="flex items-center gap-1 text-[#9C9CA1] transition-colors hover:text-[#F4F4F2]"
            >
              <span class="text-[13px] font-semibold whitespace-nowrap"
                >EN</span
              >
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

            <Button variant="outlined" size="sm" @click="closeMenu"
              >LOG IN</Button
            >
          </div>
        </aside>
      </Transition>
    </Teleport>
  </nav>
</template>
