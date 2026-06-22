import { describe, test, expect } from 'vitest'
import { evaluateAchievements, ACHIEVEMENTS, type AchievementStats } from './achievements'

const zero: AchievementStats = {
  gamesPlayed: 0,
  highScore: 0,
  totalXp: 0,
  bestStreak: 0,
  totalCorrect: 0,
  maxLevelReached: 1,
  dailyChallengesCompleted: 0,
}

describe('evaluateAchievements', () => {
  test('unlocks nothing for a fresh player', () => {
    expect(evaluateAchievements(zero)).toEqual([])
  })

  test('unlocks First Steps after one game', () => {
    expect(evaluateAchievements({ ...zero, gamesPlayed: 1 })).toContain('first-game')
  })

  test('unlocks streak tiers progressively', () => {
    expect(evaluateAchievements({ ...zero, bestStreak: 5 })).toContain('streak-5')
    expect(evaluateAchievements({ ...zero, bestStreak: 5 })).not.toContain('streak-10')
    expect(evaluateAchievements({ ...zero, bestStreak: 10 })).toContain('streak-10')
  })

  test('unlocks daily devotee after a daily challenge', () => {
    expect(evaluateAchievements({ ...zero, dailyChallengesCompleted: 1 })).toContain('daily-1')
  })

  test('unlocks everything when all thresholds are exceeded', () => {
    const maxed: AchievementStats = {
      gamesPlayed: 1000,
      highScore: 100000,
      totalXp: 100000,
      bestStreak: 100,
      totalCorrect: 1000,
      maxLevelReached: 5,
      dailyChallengesCompleted: 100,
    }
    expect(evaluateAchievements(maxed)).toHaveLength(ACHIEVEMENTS.length)
  })

  test('all achievement ids are unique', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
