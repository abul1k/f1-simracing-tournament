<script setup lang="ts">
import { ref } from 'vue'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useBanner } from '../model'

import 'swiper/css'
import 'swiper/css/pagination'

const { modules, bannercontent } = useBanner()

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
      class="banner md:h-121.5 w-full"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="banner in bannercontent">
        <a
          :href="banner.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group bg-graphite relative flex! h-full items-center justify-center overflow-hidden"
        >
          <img
            class="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl brightness-50"
            :src="banner.previewImage"
            alt=""
            aria-hidden="true"
          />
          <img
            class="relative z-10 h-full w-auto max-w-full object-contain"
            :src="banner.previewImage"
          />

          <span
            class="absolute z-20 flex h-12 w-17 items-center justify-center rounded-lg bg-black/60 transition-colors group-hover:bg-racing-red"
            aria-hidden="true"
          >
            <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        </a>
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
