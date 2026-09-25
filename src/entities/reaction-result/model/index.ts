export type GradeName =
  | 'Lightning'
  | 'Race Pace'
  | 'Midfield'
  | 'Backmarker'
  | 'Stalled'

/** A finished reaction test — everything needed to show or share it. */
export interface ReactionResult {
  /** Mean of the launches, in ms. */
  average: number
  /** Quickest launch, in ms. */
  best: number
  grade: GradeName
  /** The grade's colour as a `#RRGGBB` hex. */
  gradeColor: string
  /** Every launch's reaction time in ms, in the order they were run. */
  launches: number[]
}
