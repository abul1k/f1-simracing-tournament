import { computed, type ComputedRef } from 'vue'
import type { GradeName } from '@/entities/reaction-result/model'
import { useReactionTestStore } from '@/features/reaction-test/test-panel/model/store'

export interface Grade {
  key: string
  name: GradeName
  range: string
  /** Upper bound in ms, exclusive. The last grade has no ceiling. */
  below: number
  color: string
  /** Bar length as a share of the track, 0–100. */
  bar: number
  note: string
}

export const grades: Grade[] = [
  {
    key: 'lightning',
    name: 'Lightning',
    range: '< 200 ms',
    below: 200,
    color: '#B24BD0',
    bar: 100,
    note: 'Top 3% — pro-grade launch',
  },
  {
    key: 'race-pace',
    name: 'Race Pace',
    range: '200 – 249 ms',
    below: 250,
    color: '#00A83E',
    bar: 80,
    note: 'Quicker than most of the grid',
  },
  {
    key: 'midfield',
    name: 'Midfield',
    range: '250 – 319 ms',
    below: 320,
    color: '#B8A32E',
    bar: 60,
    note: 'Around 45% of all launches',
  },
  {
    key: 'backmarker',
    name: 'Backmarker',
    range: '320 – 399 ms',
    below: 400,
    color: '#FF7A18',
    bar: 41,
    note: 'Slower than 80% of players',
  },
  {
    key: 'stalled',
    name: 'Stalled',
    range: '400 ms +',
    below: Infinity,
    color: '#E10600',
    bar: 21,
    note: 'Bottom 10% — have another go',
  },
]

/** The grade a reaction time falls into. */
export const gradeFor = (ms: number): Grade =>
  grades.find((grade) => ms < grade.below) ?? grades[grades.length - 1]

/** A row of the grading table. */
export interface GradeRow extends Grade {
  /** The grade the driver's latest average falls into. */
  yours: boolean
}

/**
 * The grading table, with the row matching the latest completed test's
 * average highlighted and its note swapped for that average.
 */
export const useGradeRows = (): ComputedRef<GradeRow[]> => {
  const store = useReactionTestStore()

  return computed(() => {
    const latest = store.latestAverage
    const yours = latest === null ? undefined : gradeFor(latest).key

    return grades.map((grade) => {
      const isYours = grade.key === yours

      return {
        ...grade,
        yours: isYours,
        note: isYours ? `Your latest average — ${latest} ms` : grade.note,
      }
    })
  })
}
