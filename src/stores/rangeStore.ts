import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RangeState, RangeStats } from '@/types/range'

interface RangeStore extends RangeState {
  setRange: (start: number, end: number, step: number) => void
  addHistory: (stats: RangeStats) => void
  clearHistory: () => void
  toggleDarkMode: () => void
}

export const useRangeStore = create<RangeStore>()(
  persist(
    (set) => ({
      start: 1,
      end: 100,
      step: 1,
      isDarkMode: true,
      history: [],
      
      setRange: (start, end, step) => set({ start, end, step }),
      addHistory: (stats) => set((state) => ({
        history: [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          stats
        }, ...state.history].slice(0, 50)
      })),
      clearHistory: () => set({ history: [] }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'range-storage',
    }
  )
)
