<script setup lang="ts">
import { ref } from 'vue'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useBanner } from '../model'

import 'swiper/css'
import 'swiper/css/pagination'

const { modules } = useBanner()

const swiper = ref<SwiperInstance>()

const onSwiper = (instance: SwiperInstance) => {
  swiper.value = instance
}
</script>

<template>
  <div class="relative w-full">
    <Swiper
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 5000 }"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
      class="banner w-full"
      @swiper="onSwiper"
    >
      <SwiperSlide
        v-for="banner in 3"
        :key="banner"
        class="bg-graphite flex! min-h-121.5 items-center justify-center"
      >
        <h1 class="text-still-gray text-2xl font-bold text-center">
          BANNER CONTENT
        </h1>
      </SwiperSlide>
    </Swiper>

    <button
      type="button"
      aria-label="Previous slide"
      class="cursor-pointer absolute top-1/2 left-3 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center text-[#9C9CA1] transition-colors hover:text-[#F4F4F2] sm:flex lg:left-5"
      @click="swiper?.slidePrev()"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>

    <button
      type="button"
      aria-label="Next slide"
      class="cursor-pointer absolute top-1/2 right-3 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center text-[#9C9CA1] transition-colors hover:text-[#F4F4F2] sm:flex lg:right-5"
      @click="swiper?.slideNext()"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.banner {
  /* Square hairline bars instead of round dots, matching the site's
     sharp-cornered, muted-gray-to-red accent language. */
  --swiper-pagination-bottom: 20px;
  --swiper-pagination-bullet-width: 18px;
  --swiper-pagination-bullet-height: 2px;
  --swiper-pagination-bullet-border-radius: 0;
  --swiper-pagination-bullet-horizontal-gap: 3px;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-inactive-color: #f4f4f2;
  --swiper-pagination-bullet-inactive-opacity: 0.2;
  --swiper-pagination-color: var(--color-racing-red);
}

.banner :deep(.swiper-pagination-bullet) {
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.banner :deep(.swiper-pagination-bullet:hover) {
  opacity: 0.6;
}

.banner :deep(.swiper-pagination-bullet-active:hover) {
  opacity: 1;
}
</style>
