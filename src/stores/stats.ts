import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StatsState {
  totalCalculations: number
  totalRangesAnalyzed: number
  totalElementsProcessed: number
  totalTimeSpent: number
  lastSessionDate: string | null

  recordCalculation: () => void
  recordRangeAnalyzed: (elements: number) => void
  addElementsProcessed: (count: number) => void
  addTimeSpent: (seconds: number) => void
  resetStats: () => void
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      totalCalculations: 0,
      totalRangesAnalyzed: 0,
      totalElementsProcessed: 0,
      totalTimeSpent: 0,
      lastSessionDate: null,

      recordCalculation: () => set((state) => ({
        totalCalculations: state.totalCalculations + 1,
        lastSessionDate: new Date().toISOString()
      })),
      recordRangeAnalyzed: (elements) => set((state) => ({
        totalRangesAnalyzed: state.totalRangesAnalyzed + 1,
        totalElementsProcessed: state.totalElementsProcessed + elements
      })),
      addElementsProcessed: (count) => set((state) => ({
        totalElementsProcessed: state.totalElementsProcessed + count
      })),
      addTimeSpent: (seconds) => set((state) => ({
        totalTimeSpent: state.totalTimeSpent + seconds
      })),
      resetStats: () => set({
        totalCalculations: 0,
        totalRangesAnalyzed: 0,
        totalElementsProcessed: 0,
        totalTimeSpent: 0,
        lastSessionDate: null,
      }),
    }),
    {
      name: 'rangesync-stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
