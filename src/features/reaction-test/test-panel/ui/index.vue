<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { ReactionResult } from '@/entities/reaction-result/model'
import { gradeFor } from '@/features/reaction-test/grading-action/model'
import { LIGHT_COLUMNS, LIGHTS_PER_COLUMN, launchLabel } from '../model'
import { useReactionTestStore } from '../model/store'

withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    subtitle?: string
  }>(),
  {
    eyebrow: 'FUN ZONE',
    title: 'Reaction Test',
    subtitle:
      'Five launches. Lights out and away we go — how fast are you off the line?',
  },
)

defineSlots<{
  /** Above the panel, e.g. a challenge banner. */
  banner?: () => unknown
  /** Under the summary's best launch, e.g. the challenge outcome. */
  summary?: (props: { result: ReactionResult }) => unknown
  /** Beside TRY AGAIN on the summary, e.g. a share button. */
  actions?: (props: { result: ReactionResult }) => unknown
}>()

const store = useReactionTestStore()
const {
  phase,
  launch,
  times,
  litColumns,
  lastTime,
  average,
  best,
  isLastLaunch,
} = storeToRefs(store)

const panel = ref<HTMLElement>()
const isFullscreen = ref(false)
const canFullscreen = ref(false)

const showGantry = computed(() =>
  ['idle', 'lights', 'armed', 'go', 'jump'].includes(phase.value),
)

const theme = computed(() => {
  if (phase.value === 'go')
    return { panel: 'bg-[#0A1A10] border-[#1C5E33]', dot: 'bg-[#00A83E]' }
  if (phase.value === 'jump')
    return { panel: 'bg-[#1A1206] border-[#6B4E12]', dot: 'bg-[#F5A623]' }
  if (phase.value === 'result' || phase.value === 'summary')
    return { panel: 'bg-[#131316] border-[#26262B]', dot: 'bg-[#00A83E]' }

  return { panel: 'bg-[#131316] border-[#26262B]', dot: 'bg-racing-red' }
})

const lastGrade = computed(() =>
  lastTime.value === null ? undefined : gradeFor(lastTime.value),
)
const averageGrade = computed(() =>
  average.value === null ? undefined : gradeFor(average.value),
)

/** The finished test, once every launch is in. */
const result = computed<ReactionResult | null>(() => {
  if (
    phase.value !== 'summary' ||
    average.value === null ||
    best.value === null ||
    !averageGrade.value
  )
    return null

  return {
    average: average.value,
    best: best.value,
    grade: averageGrade.value.name,
    gradeColor: averageGrade.value.color,
    launches: times.value.filter((time): time is number => time !== null),
  }
})

const onPointerDown = (event: PointerEvent) => {
  if (event.button !== 0) return

  store.press(event.timeStamp)
}

const isInteractive = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  target.closest('button, a, input, select, textarea') !== null

const onKeyDown = (event: KeyboardEvent) => {
  if (event.code !== 'Space' || event.repeat || isInteractive(event.target))
    return

  // Space would otherwise scroll the page mid-launch.
  event.preventDefault()
  store.press(event.timeStamp)
}

const toggleFullscreen = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await panel.value?.requestFullscreen()
  } catch {
    // Refused by the browser — the panel just stays inline.
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = document.fullscreenElement === panel.value
}

onMounted(() => {
  canFullscreen.value = document.fullscreenEnabled
  window.addEventListener('keydown', onKeyDown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  // Stops any running light sequence and starts fresh on the next visit.
  store.reset()
})
</script>

<template>
  <section class="flex w-full flex-col gap-11">
    <div class="flex flex-col gap-2.5">
      <p class="text-[12px] font-extrabold tracking-[2.2px] text-racing-red">
        {{ eyebrow }}
      </p>
      <h1
        class="text-[34px] font-extrabold tracking-[-1px] text-white sm:text-[46px]"
      >
        {{ title }}
      </h1>
      <p class="text-[15px] font-medium text-[#8A8A93]">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex w-full flex-col gap-4">
      <slot name="banner" />

      <div
        ref="panel"
        class="flex w-full cursor-pointer touch-manipulation flex-col rounded-[2px] border p-4 select-none sm:p-6"
        :class="[theme.panel, isFullscreen ? 'h-full' : 'h-[480px]']"
        @pointerdown="onPointerDown"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="h-[7px] w-[7px] shrink-0 rounded-full"
              :class="theme.dot"
            ></span>
            <span
              class="font-mono text-[11px] font-medium tracking-[1.6px] whitespace-nowrap text-[#8A8A93]"
            >
              F1 START LIGHTS
            </span>
          </div>
          <span
            class="font-mono text-[11px] font-medium tracking-[1.6px] whitespace-nowrap"
            :class="
              phase === 'summary'
                ? 'text-white'
                : phase === 'jump'
                  ? 'text-[#F5A623]'
                  : 'text-[#8A8A93]'
            "
          >
            {{ phase === 'summary' ? 'COMPLETE' : launchLabel(launch) }}
          </span>
        </div>

        <div
          class="flex w-full flex-1 flex-col items-center justify-center text-center"
          :class="showGantry ? 'gap-[30px]' : 'gap-2.5'"
        >
          <div
            v-if="showGantry"
            class="flex gap-3 rounded-[10px] border border-[#1C1C21] bg-[#08080A] p-4 sm:gap-[18px] sm:p-5"
            aria-hidden="true"
          >
            <div
              v-for="column in LIGHT_COLUMNS"
              :key="column"
              class="flex flex-col gap-2.5 sm:gap-3"
            >
              <span
                v-for="light in LIGHTS_PER_COLUMN"
                :key="light"
                class="h-9 w-9 rounded-full border sm:h-[46px] sm:w-[46px]"
                :class="
                  column <= litColumns
                    ? 'border-[#FF6B6B] bg-[#FF2A2A] shadow-[0_0_26px_2px_#FF2A2A73,0_-3px_8px_0_#FFFFFF40]'
                    : 'border-[#242429] bg-[#17171A] shadow-[0_2px_6px_0_#000000B3]'
                "
              ></span>
            </div>
          </div>

          <div v-if="phase === 'idle'" class="flex flex-col items-center gap-3">
            <p
              class="font-mono text-[12px] font-medium tracking-[2.4px] text-white sm:text-[13px]"
            >
              CLICK, TAP OR PRESS SPACE TO START
            </p>
            <span
              class="h-[2px] w-16 animate-pulse bg-racing-red opacity-55"
            ></span>
          </div>

          <p
            v-else-if="phase === 'lights' || phase === 'armed'"
            class="font-mono text-[13px] font-medium tracking-[4px] text-[#8A8A93]"
          >
            HOLD…
          </p>

          <p
            v-else-if="phase === 'go'"
            class="text-[44px] font-extrabold tracking-[-1.5px] whitespace-nowrap text-white sm:text-[72px]"
          >
            GO GO GO
          </p>

          <div v-else-if="phase === 'jump'" class="flex flex-col items-center gap-3.5">
            <p
              class="text-[36px] font-extrabold tracking-[-0.5px] whitespace-nowrap text-[#F5A623] sm:text-[56px]"
            >
              JUMP START
            </p>
            <p class="text-[14px] font-medium text-[#8A8A93]">
              Penalty — you moved before lights-out. Launch voided, resetting…
            </p>
          </div>

          <template v-else-if="phase === 'result' && lastTime !== null">
            <p
              class="font-mono text-[11px] font-medium tracking-[2.4px] text-[#8A8A93]"
            >
              {{ launchLabel(launch) }}
            </p>
            <div class="flex items-end gap-2">
              <span
                class="font-mono text-[72px] leading-none font-bold tracking-[-2px] text-white sm:text-[104px]"
              >
                {{ lastTime }}
              </span>
              <span
                class="pb-1.5 font-mono text-[20px] font-medium text-[#8A8A93] sm:pb-3 sm:text-[25px]"
              >
                ms
              </span>
            </div>
            <p
              class="text-[18px] font-extrabold tracking-[2.6px] uppercase"
              :style="{ color: lastGrade?.color }"
            >
              {{ lastGrade?.name }}
            </p>
            <p
              class="pt-[18px] font-mono text-[12px] font-medium tracking-[2px] text-[#5A5A63]"
            >
              {{ isLastLaunch ? 'CLICK FOR YOUR SUMMARY' : 'CLICK FOR NEXT LAUNCH' }}
            </p>
          </template>

          <template v-else-if="phase === 'summary' && result">
            <div class="mb-1.5 flex flex-col" aria-hidden="true">
              <div v-for="row in 2" :key="row" class="flex">
                <span
                  v-for="cell in 8"
                  :key="cell"
                  class="h-1 w-3"
                  :class="(row + cell) % 2 ? 'bg-white' : 'bg-racing-red'"
                ></span>
              </div>
            </div>
            <p
              class="font-mono text-[11px] font-medium tracking-[2.4px] text-[#8A8A93]"
            >
              AVERAGE
            </p>
            <div class="flex items-end gap-2">
              <span
                class="font-mono text-[64px] leading-none font-bold tracking-[-2px] text-white sm:text-[88px]"
              >
                {{ average }}
              </span>
              <span
                class="pb-1.5 font-mono text-[18px] font-medium text-[#8A8A93] sm:pb-2.5 sm:text-[21px]"
              >
                ms
              </span>
            </div>
            <p
              class="text-[18px] font-extrabold tracking-[2.6px] uppercase"
              :style="{ color: averageGrade?.color }"
            >
              {{ averageGrade?.name }}
            </p>
            <div class="flex items-center gap-2.5">
              <span
                class="font-mono text-[11px] font-medium tracking-[2px] text-[#5A5A63]"
              >
                BEST LAUNCH
              </span>
              <span class="font-mono text-[12px] font-bold text-white">
                {{ best }} ms
              </span>
            </div>
            <slot name="summary" :result="result" />
            <div
              class="flex flex-wrap justify-center gap-3 pt-3.5"
              @pointerdown.stop
            >
              <button
                type="button"
                class="cursor-pointer rounded-[2px] bg-racing-red px-7 py-3.5 text-[13px] font-extrabold tracking-[1.4px] text-white transition-colors hover:bg-[#A8322B]"
                @click="store.reset()"
              >
                TRY AGAIN
              </button>
              <slot name="actions" :result="result" />
            </div>
          </template>
        </div>

        <div class="flex w-full justify-end">
          <button
            v-if="canFullscreen"
            type="button"
            class="cursor-pointer text-[#5A5A63] transition-colors hover:text-[#8A8A93]"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
            @pointerdown.stop
            @click="toggleFullscreen"
          >
            <svg
              class="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <template v-if="isFullscreen">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </template>
              <template v-else>
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </template>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
