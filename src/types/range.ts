export interface RangeStats {
  start: number
  end: number
  step: number
  count: number
  sum: number
  average: number
  min: number
  max: number
  stdDev: number
}

export interface RangeHistory {
  id: string
  timestamp: string
  stats: RangeStats
}

export interface RangeState {
  start: number
  end: number
  step: number
  isDarkMode: boolean
  history: RangeHistory[]
}
