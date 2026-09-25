import { computed, type ComputedRef } from 'vue'
import { useReactionTestStore } from '@/features/reaction-test/test-panel/model/store'

/** One slot in the row of launch results under the panel. */
export interface LaunchSlot {
  label: string
  /** Reaction time in ms, null until the launch is run. */
  value: number | null
  /** The launch being run now. */
  current: boolean
  /** Quickest launch of the run so far. */
  best: boolean
}

export const useLaunchSlots = (): ComputedRef<LaunchSlot[]> => {
  const store = useReactionTestStore()

  return computed(() =>
    store.times.map((value, index) => ({
      label: `L${index + 1}`,
      value,
      current: store.phase !== 'summary' && index === store.launch,
      best: value !== null && value === store.best,
    })),
  )
}
