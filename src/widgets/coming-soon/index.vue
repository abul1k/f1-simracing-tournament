<script setup lang="ts">
/**
 * Full-page placeholder for a section that is routed but not built yet.
 * Keeps navbar links working instead of dead-ending on a blank page.
 */
withDefaults(
  defineProps<{
    title: string
    eyebrow?: string
    message?: string
  }>(),
  {
    eyebrow: 'COMING SOON',
    message:
      'This section is still being built. It will open later in Season 1 — everything else on the site is live in the meantime.',
  },
)
</script>

<template>
  <div class="flex flex-col gap-9 bg-[#0A0A0B] pt-10 pb-16">
    <section class="flex w-full flex-col gap-6">
      <div class="flex flex-col gap-1.5">
        <p class="text-[12px] font-bold tracking-[1.2px] text-racing-red">
          {{ eyebrow }}
        </p>
        <h1 class="text-[30px] font-extrabold text-[#F4F4F2]">{{ title }}</h1>
      </div>

      <div
        class="flex flex-col items-center gap-4 border border-[#2A2A2E] bg-[#141416] px-6 py-20 text-center"
      >
        <!-- Pit-lane kerb: red and white blocks, the trackside marking for
             an area that is closed to traffic. -->
        <div class="flex h-[7px] w-[132px] overflow-hidden rounded-[1px]">
          <span
            v-for="block in 8"
            :key="block"
            class="h-full flex-1"
            :class="block % 2 ? 'bg-racing-red' : 'bg-[#F4F4F2]'"
          ></span>
        </div>

        <p class="pt-1 text-[17px] font-bold text-[#F4F4F2]">Under development</p>

        <p class="max-w-[440px] text-[13px] leading-relaxed text-[#68686D]">
          {{ message }}
        </p>

        <RouterLink
          to="/"
          class="mt-2 flex items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] text-racing-red transition-opacity hover:opacity-75"
        >
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
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          BACK TO CHAMPIONSHIP
        </RouterLink>
      </div>
    </section>
  </div>
</template>
