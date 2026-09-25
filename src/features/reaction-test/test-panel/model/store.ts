import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  JUMP_RESET,
  LAUNCHES,
  LIGHT_COLUMNS,
  LIGHT_INTERVAL,
  RESULT_GUARD,
  averageOf,
  bestOf,
  emptyTimes,
  loadLatestAverage,
  randomHold,
  saveLatestAverage,
  type LaunchTime,
  type Phase,
} from '.'

/**
 * One reaction test run: five launches, each a start-lights sequence followed
 * by a timed press. The launch history and grading sections read from here
 * too, so the whole page reflects the same run.
 */
export const useReactionTestStore = defineStore('reaction-test', () => {
  const phase = ref<Phase>('idle')
  /** Index of the current launch, 0-based. */
  const launch = ref(0)
  const times = ref<LaunchTime[]>(emptyTimes())
  /** How many gantry columns are lit. */
  const litColumns = ref(0)
  /** Average of the last completed test, persisted between visits. */
  const latestAverage = ref<number | null>(loadLatestAverage())

  let timers: ReturnType<typeof setTimeout>[] = []
  let lightsOutAt = 0
  let resultAt = 0

  const average = computed(() => averageOf(times.value))
  const best = computed(() => bestOf(times.value))
  const lastTime = computed(() => times.value[launch.value] ?? null)
  const isLastLaunch = computed(() => launch.value === LAUNCHES - 1)

  const later = (callback: () => void, delay: number) => {
    timers.push(setTimeout(callback, delay))
  }

  const clearTimers = () => {
    timers.forEach(clearTimeout)
    timers = []
  }

  const startSequence = () => {
    clearTimers()
    phase.value = 'lights'
    litColumns.value = 0

    for (let column = 1; column <= LIGHT_COLUMNS; column++) {
      later(() => {
        litColumns.value = column

        if (column === LIGHT_COLUMNS) {
          phase.value = 'armed'
          later(lightsOut, randomHold())
        }
      }, column * LIGHT_INTERVAL)
    }
  }

  const lightsOut = () => {
    litColumns.value = 0
    phase.value = 'go'
    lightsOutAt = performance.now()
  }

  const jumpStart = () => {
    clearTimers()
    phase.value = 'jump'
    litColumns.value = 0

    // The launch is voided, not counted — back to the start of the same one.
    later(() => {
      phase.value = 'idle'
    }, JUMP_RESET)
  }

  const record = (at: number) => {
    const next = [...times.value]
    next[launch.value] = Math.round(at - lightsOutAt)
    times.value = next
    phase.value = 'result'
    resultAt = at
  }

  const finish = () => {
    phase.value = 'summary'

    if (average.value !== null) {
      latestAverage.value = average.value
      saveLatestAverage(average.value)
    }
  }

  /**
   * The single input of the test — a click, tap or Space press. What it does
   * depends on where in the sequence it lands.
   * @param at `performance.now()` at the moment of the press, taken as early
   * as possible so handler work does not count against the driver.
   */
  const press = (at: number = performance.now()) => {
    switch (phase.value) {
      case 'idle':
        startSequence()
        break
      case 'lights':
      case 'armed':
        jumpStart()
        break
      case 'go':
        record(at)
        break
      case 'result':
        if (at - resultAt < RESULT_GUARD) return

        if (isLastLaunch.value) {
          finish()
        } else {
          launch.value++
          startSequence()
        }
        break
    }
  }

  /** Back to launch 1 with an empty history. */
  const reset = () => {
    clearTimers()
    phase.value = 'idle'
    launch.value = 0
    times.value = emptyTimes()
    litColumns.value = 0
  }

  return {
    phase,
    launch,
    times,
    litColumns,
    latestAverage,
    average,
    best,
    lastTime,
    isLastLaunch,
    press,
    reset,
  }
})
