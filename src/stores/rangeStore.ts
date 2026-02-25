import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RangeState, RangeStats, CustomFormula } from '@/types/range'

interface RangeStore extends RangeState {
  setRange: (start: number, end: number, step: number) => void
  addHistory: (stats: RangeStats) => void
  clearHistory: () => void
  toggleDarkMode: () => void
  addFavorite: (name: string, start: number, end: number, step: number) => void
  removeFavorite: (id: string) => void
  loadFavorite: (id: string) => void
  addCustomFormula: (formula: Omit<CustomFormula, 'id' | 'createdAt'>) => void
  removeCustomFormula: (id: string) => void
  updateCustomFormula: (id: string, formula: Partial<CustomFormula>) => void
}

export const useRangeStore = create<RangeStore>()(
  persist(
    (set) => ({
      start: 1,
      end: 100,
      step: 1,
      isDarkMode: true,
      history: [],
      favorites: [],
      customFormulas: [],
      
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
      
      addFavorite: (name, start, end, step) => set((state) => ({
        favorites: [{
          id: Math.random().toString(36).substr(2, 9),
          name,
          start,
          end,
          step,
          createdAt: new Date().toISOString()
        }, ...state.favorites].slice(0, 20)
      })),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id)
      })),
      loadFavorite: (id) => set((state) => {
        const fav = state.favorites.find(f => f.id === id)
        return fav ? { start: fav.start, end: fav.end, step: fav.step } : state
      }),
      
      addCustomFormula: (formula) => set((state) => ({
        customFormulas: [{
          ...formula,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        }, ...state.customFormulas]
      })),
      removeCustomFormula: (id) => set((state) => ({
        customFormulas: state.customFormulas.filter(f => f.id !== id)
      })),
      updateCustomFormula: (id, formula) => set((state) => ({
        customFormulas: state.customFormulas.map(f => 
          f.id === id ? { ...f, ...formula } : f
        )
      })),
    }),
    {
      name: 'range-storage',
    }
  )
)
