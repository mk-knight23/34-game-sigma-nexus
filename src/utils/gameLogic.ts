/**
 * Pure game logic for the "Guess the Sum" challenge mode.
 *
 * Everything here is deterministic and side-effect free so it can be unit
 * tested without a DOM. Difficulty progression, seeded round generation, the
 * daily challenge seed, and scoring all live in this module.
 */

import { calculateRangeStats } from './mathUtils'

export interface Difficulty {
  level: number
  name: string
  /** Inclusive bounds for the randomly generated start value. */
  startRange: [number, number]
  /** Inclusive bounds for the length (count of terms) of the range. */
  lengthRange: [number, number]
  /** Allowed step values for this difficulty. */
  steps: number[]
  /** Seconds allowed to answer a round at this difficulty. */
  timeLimit: number
  /** Whether negative starts / descending ranges are allowed. */
  allowNegative: boolean
}

export interface ChallengeRound {
  start: number
  end: number
  step: number
  answer: number
  timeLimit: number
}

export interface ScoreInput {
  /** Whether the submitted guess was correct. */
  correct: boolean
  /** Seconds remaining on the clock when the answer was submitted. */
  timeRemaining: number
  /** Total seconds allowed for the round. */
  timeLimit: number
  /** Current streak BEFORE this answer (used for the streak bonus). */
  streak: number
  /** Difficulty level (1-based) of the round. */
  level: number
}

export interface ScoreResult {
  /** Points awarded for this round (0 if incorrect). */
  points: number
  /** Base points before bonuses. */
  base: number
  /** Speed bonus component. */
  speedBonus: number
  /** Streak bonus component. */
  streakBonus: number
}

export const BASE_POINTS = 100
export const MAX_SPEED_BONUS = 100
export const STREAK_BONUS_PER_STEP = 10
export const MAX_STREAK_BONUS = 100
/** XP awarded equals points scored, scaled down by this factor. */
export const XP_PER_POINT = 0.1

/**
 * The difficulty ladder. Ranges get longer, steps grow, the timer shrinks,
 * and negatives appear as the player climbs.
 */
export const DIFFICULTIES: readonly Difficulty[] = [
  {
    level: 1,
    name: 'Rookie',
    startRange: [1, 10],
    lengthRange: [3, 6],
    steps: [1],
    timeLimit: 30,
    allowNegative: false,
  },
  {
    level: 2,
    name: 'Apprentice',
    startRange: [1, 25],
    lengthRange: [4, 9],
    steps: [1, 2],
    timeLimit: 25,
    allowNegative: false,
  },
  {
    level: 3,
    name: 'Adept',
    startRange: [-10, 30],
    lengthRange: [5, 12],
    steps: [1, 2, 3],
    timeLimit: 22,
    allowNegative: true,
  },
  {
    level: 4,
    name: 'Expert',
    startRange: [-25, 50],
    lengthRange: [6, 15],
    steps: [2, 3, 5],
    timeLimit: 18,
    allowNegative: true,
  },
  {
    level: 5,
    name: 'Master',
    startRange: [-50, 80],
    lengthRange: [8, 20],
    steps: [2, 3, 5, 7],
    timeLimit: 15,
    allowNegative: true,
  },
]

/**
 * Returns the difficulty for a given level (1-based), clamping to the top
 * difficulty once the player has maxed out the ladder.
 */
export function getDifficulty(level: number): Difficulty {
  if (level < 1) return DIFFICULTIES[0]
  const index = Math.min(level - 1, DIFFICULTIES.length - 1)
  return DIFFICULTIES[index]
}

/**
 * Number of correct answers required to advance one level.
 */
export const CORRECT_ANSWERS_PER_LEVEL = 3

/**
 * Computes the current level (1-based) from a count of correct answers.
 */
export function levelForCorrectCount(correctCount: number): number {
  return Math.floor(correctCount / CORRECT_ANSWERS_PER_LEVEL) + 1
}

/**
 * Mulberry32 — a tiny, fast, deterministic PRNG. Given the same seed it
 * always produces the same sequence, which is what makes the daily challenge
 * reproducible across devices.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Picks an integer in [min, max] inclusive from a [0,1) random source. */
function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

/**
 * Generates a deterministic challenge round for the given difficulty using the
 * supplied PRNG. The same rng state always yields the same round.
 */
export function generateRound(difficulty: Difficulty, rng: () => number): ChallengeRound {
  const step = difficulty.steps[randInt(rng, 0, difficulty.steps.length - 1)]
  const start = randInt(rng, difficulty.startRange[0], difficulty.startRange[1])
  const length = randInt(rng, difficulty.lengthRange[0], difficulty.lengthRange[1])

  // Build an ascending range of `length` terms with the chosen step.
  const end = start + (length - 1) * step
  const stats = calculateRangeStats(start, end, step)

  return {
    start,
    end,
    step,
    answer: stats.sum,
    timeLimit: difficulty.timeLimit,
  }
}

/**
 * Generates a random round for a level using a non-deterministic source by
 * default (Math.random), or an injected rng for testing.
 */
export function generateRoundForLevel(level: number, rng: () => number = Math.random): ChallengeRound {
  return generateRound(getDifficulty(level), rng)
}

/**
 * Converts a calendar date into a stable integer seed (YYYYMMDD). The daily
 * challenge uses this so every player on the same UTC-equivalent local day
 * faces the same range.
 */
export function dateSeed(date: Date): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return y * 10000 + m * 100 + d
}

/** "YYYY-MM-DD" key used to scope a per-day best score. */
export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Builds the deterministic daily challenge round for a given date. Always the
 * same range for the same calendar day. Uses a fixed mid-tier difficulty so
 * the daily is fair regardless of the player's current level.
 */
export function dailyChallenge(date: Date): ChallengeRound {
  const seed = dateSeed(date)
  const rng = mulberry32(seed)
  // Daily challenge uses "Adept" (level 3) for a consistent challenge.
  return generateRound(getDifficulty(3), rng)
}

/**
 * Scores a single answered round. Incorrect answers always score 0. Correct
 * answers earn base points plus a speed bonus (proportional to time left) and
 * a streak bonus (capped).
 */
export function scoreRound(input: ScoreInput): ScoreResult {
  if (!input.correct) {
    return { points: 0, base: 0, speedBonus: 0, streakBonus: 0 }
  }

  const base = BASE_POINTS

  const safeLimit = input.timeLimit > 0 ? input.timeLimit : 1
  const ratio = Math.max(0, Math.min(1, input.timeRemaining / safeLimit))
  const speedBonus = Math.round(ratio * MAX_SPEED_BONUS)

  const streakBonus = Math.min(MAX_STREAK_BONUS, input.streak * STREAK_BONUS_PER_STEP)

  // Higher levels multiply the whole reward slightly.
  const levelMultiplier = 1 + (Math.max(1, input.level) - 1) * 0.1
  const points = Math.round((base + speedBonus + streakBonus) * levelMultiplier)

  return { points, base, speedBonus, streakBonus }
}

/** Converts points earned into XP. */
export function xpForPoints(points: number): number {
  return Math.round(points * XP_PER_POINT)
}

/**
 * XP required to reach a given player level (1-based). Uses a gentle quadratic
 * curve so early levels come fast and later ones take longer.
 */
export function xpForPlayerLevel(playerLevel: number): number {
  if (playerLevel <= 1) return 0
  return 50 * (playerLevel - 1) * (playerLevel - 1)
}

/** Derives the player's current level from total accumulated XP. */
export function playerLevelForXp(totalXp: number): number {
  let level = 1
  while (xpForPlayerLevel(level + 1) <= totalXp) {
    level++
  }
  return level
}
