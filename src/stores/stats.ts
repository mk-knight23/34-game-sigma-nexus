import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  xpForPoints,
  playerLevelForXp,
  levelForCorrectCount,
  dateKey,
} from '@/utils/gameLogic'
import { evaluateAchievements, type AchievementStats } from '@/utils/achievements'

interface StatsState {
  // --- Range trainer usage stats (existing) ---
  totalCalculations: number
  totalRangesAnalyzed: number
  totalElementsProcessed: number
  totalTimeSpent: number
  lastSessionDate: string | null

  // --- Game / scoring stats (consolidated from the old gameStore) ---
  scores: number[]
  gamesPlayed: number
  highScore: number
  totalXp: number
  totalCorrect: number
  bestStreak: number
  maxLevelReached: number
  unlockedAchievements: string[]

  // --- Daily challenge ---
  dailyChallengesCompleted: number
  /** Map of "YYYY-MM-DD" -> best score for that day. */
  dailyBest: Record<string, number>

  // Range trainer actions (existing)
  recordCalculation: () => void
  recordRangeAnalyzed: (elements: number) => void
  addElementsProcessed: (count: number) => void
  addTimeSpent: (seconds: number) => void

  // Game actions
  recordGame: (score: number, opts?: { correct?: number; bestStreak?: number; maxLevel?: number }) => void
  recordDailyResult: (date: Date, score: number) => void
  resetStats: () => void
}

function deriveAchievementStats(state: StatsState): AchievementStats {
  return {
    gamesPlayed: state.gamesPlayed,
    highScore: state.highScore,
    totalXp: state.totalXp,
    bestStreak: state.bestStreak,
    totalCorrect: state.totalCorrect,
    maxLevelReached: state.maxLevelReached,
    dailyChallengesCompleted: state.dailyChallengesCompleted,
  }
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      totalCalculations: 0,
      totalRangesAnalyzed: 0,
      totalElementsProcessed: 0,
      totalTimeSpent: 0,
      lastSessionDate: null,

      scores: [],
      gamesPlayed: 0,
      highScore: 0,
      totalXp: 0,
      totalCorrect: 0,
      bestStreak: 0,
      maxLevelReached: 1,
      unlockedAchievements: [],

      dailyChallengesCompleted: 0,
      dailyBest: {},

      recordCalculation: () =>
        set((state) => ({
          totalCalculations: state.totalCalculations + 1,
          lastSessionDate: new Date().toISOString(),
        })),
      recordRangeAnalyzed: (elements) =>
        set((state) => ({
          totalRangesAnalyzed: state.totalRangesAnalyzed + 1,
          totalElementsProcessed: state.totalElementsProcessed + elements,
        })),
      addElementsProcessed: (count) =>
        set((state) => ({
          totalElementsProcessed: state.totalElementsProcessed + count,
        })),
      addTimeSpent: (seconds) =>
        set((state) => ({ totalTimeSpent: state.totalTimeSpent + seconds })),

      recordGame: (score, opts = {}) =>
        set((state) => {
          const correct = opts.correct ?? 0
          const totalCorrect = state.totalCorrect + correct
          const next: StatsState = {
            ...state,
            scores: [...state.scores, score].slice(-100),
            gamesPlayed: state.gamesPlayed + 1,
            highScore: Math.max(state.highScore, score),
            totalXp: state.totalXp + xpForPoints(score),
            totalCorrect,
            bestStreak: Math.max(state.bestStreak, opts.bestStreak ?? 0),
            maxLevelReached: Math.max(
              state.maxLevelReached,
              opts.maxLevel ?? levelForCorrectCount(correct)
            ),
            lastSessionDate: new Date().toISOString(),
          }
          return {
            ...next,
            unlockedAchievements: evaluateAchievements(deriveAchievementStats(next)),
          }
        }),

      recordDailyResult: (date, score) =>
        set((state) => {
          const key = dateKey(date)
          const prevBest = state.dailyBest[key] ?? 0
          const isFirstToday = !(key in state.dailyBest)
          const next: StatsState = {
            ...state,
            dailyBest: { ...state.dailyBest, [key]: Math.max(prevBest, score) },
            dailyChallengesCompleted: state.dailyChallengesCompleted + (isFirstToday ? 1 : 0),
            highScore: Math.max(state.highScore, score),
            totalXp: state.totalXp + xpForPoints(score),
          }
          return {
            ...next,
            unlockedAchievements: evaluateAchievements(deriveAchievementStats(next)),
          }
        }),

      resetStats: () =>
        set({
          totalCalculations: 0,
          totalRangesAnalyzed: 0,
          totalElementsProcessed: 0,
          totalTimeSpent: 0,
          lastSessionDate: null,
          scores: [],
          gamesPlayed: 0,
          highScore: 0,
          totalXp: 0,
          totalCorrect: 0,
          bestStreak: 0,
          maxLevelReached: 1,
          unlockedAchievements: [],
          dailyChallengesCompleted: 0,
          dailyBest: {},
        }),
    }),
    {
      name: 'rangesync-stats',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/** Convenience selector: current player level derived from total XP. */
export function selectPlayerLevel(state: StatsState): number {
  return playerLevelForXp(state.totalXp)
}
