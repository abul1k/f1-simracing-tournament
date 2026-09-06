export interface InfoItem {
  value: string | number
  label: string
}

export const defaultInfo: InfoItem[] = [
  { value: 10, label: 'ROUNDS' },
  { value: 20, label: 'DRIVERS' },
  { value: 10, label: 'TEAMS' },
  { value: 'ROUND 6 / 10', label: 'SEASON PROGRESS' },
]
