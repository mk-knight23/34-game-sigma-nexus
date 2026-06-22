/**
 * Achievement definitions and evaluation. Pure and testable: given a snapshot
 * of the player's stats, `evaluateAchievements` returns the set of unlocked
 * achievement ids.
 */

export interface AchievementStats {
  gamesPlayed: number
  highScore: number
  totalXp: number
  bestStreak: number
  totalCorrect: number
  maxLevelReached: number
  dailyChallengesCompleted: number
}

export interface AchievementDef {
  id: string
  name: string
  description: string
  /** Returns true when this achievement should be unlocked. */
  test: (s: AchievementStats) => boolean
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Play your first challenge',
    test: (s) => s.gamesPlayed >= 1,
  },
  {
    id: 'streak-5',
    name: 'On a Roll',
    description: 'Reach a streak of 5 correct answers',
    test: (s) => s.bestStreak >= 5,
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    description: 'Reach a streak of 10 correct answers',
    test: (s) => s.bestStreak >= 10,
  },
  {
    id: 'score-1000',
    name: 'Four Figures',
    description: 'Score 1,000 points in a single game',
    test: (s) => s.highScore >= 1000,
  },
  {
    id: 'score-5000',
    name: 'High Scorer',
    description: 'Score 5,000 points in a single game',
    test: (s) => s.highScore >= 5000,
  },
  {
    id: 'games-10',
    name: 'Dedicated',
    description: 'Play 10 challenges',
    test: (s) => s.gamesPlayed >= 10,
  },
  {
    id: 'level-5',
    name: 'Master Summator',
    description: 'Reach difficulty level 5',
    test: (s) => s.maxLevelReached >= 5,
  },
  {
    id: 'correct-100',
    name: 'Centurion',
    description: 'Answer 100 rounds correctly',
    test: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'daily-1',
    name: 'Daily Devotee',
    description: 'Complete a daily challenge',
    test: (s) => s.dailyChallengesCompleted >= 1,
  },
  {
    id: 'xp-1000',
    name: 'Veteran',
    description: 'Earn 1,000 total XP',
    test: (s) => s.totalXp >= 1000,
  },
]

/** Returns the ids of all achievements that are unlocked for the given stats. */
export function evaluateAchievements(stats: AchievementStats): string[] {
  return ACHIEVEMENTS.filter((a) => a.test(stats)).map((a) => a.id)
}
