import { describe, test, expect } from 'vitest'
import {
  getDifficulty,
  levelForCorrectCount,
  mulberry32,
  generateRound,
  dateSeed,
  dateKey,
  dailyChallenge,
  scoreRound,
  xpForPoints,
  xpForPlayerLevel,
  playerLevelForXp,
  DIFFICULTIES,
  BASE_POINTS,
} from './gameLogic'
import { calculateRangeStats } from './mathUtils'

describe('difficulty ladder', () => {
  test('level 1 maps to the first (easiest) difficulty', () => {
    expect(getDifficulty(1).name).toBe('Rookie')
  })

  test('clamps to the hardest difficulty beyond the ladder', () => {
    const top = DIFFICULTIES[DIFFICULTIES.length - 1]
    expect(getDifficulty(999)).toEqual(top)
  })

  test('clamps levels below 1 to the easiest difficulty', () => {
    expect(getDifficulty(0)).toEqual(DIFFICULTIES[0])
    expect(getDifficulty(-5)).toEqual(DIFFICULTIES[0])
  })

  test('level advances every 3 correct answers', () => {
    expect(levelForCorrectCount(0)).toBe(1)
    expect(levelForCorrectCount(2)).toBe(1)
    expect(levelForCorrectCount(3)).toBe(2)
    expect(levelForCorrectCount(6)).toBe(3)
  })
})

describe('mulberry32 PRNG determinism', () => {
  test('same seed yields the same sequence', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  test('different seeds yield different sequences', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBe(b())
  })

  test('produces values in [0, 1)', () => {
    const rng = mulberry32(123)
    for (let i = 0; i < 50; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('generateRound', () => {
  test('answer matches the true sum of the generated range', () => {
    const rng = mulberry32(7)
    const round = generateRound(getDifficulty(2), rng)
    const truth = calculateRangeStats(round.start, round.end, round.step).sum
    expect(round.answer).toBe(truth)
  })

  test('respects the difficulty time limit', () => {
    const diff = getDifficulty(4)
    const round = generateRound(diff, mulberry32(9))
    expect(round.timeLimit).toBe(diff.timeLimit)
  })

  test('uses only steps allowed by the difficulty', () => {
    const diff = getDifficulty(5)
    for (let seed = 0; seed < 25; seed++) {
      const round = generateRound(diff, mulberry32(seed))
      expect(diff.steps).toContain(round.step)
    }
  })
})

describe('date seeding & daily challenge', () => {
  test('dateSeed encodes Y/M/D', () => {
    expect(dateSeed(new Date(2026, 5, 22))).toBe(20260622)
  })

  test('dateKey formats a zero-padded ISO date', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  test('daily challenge is deterministic for the same date', () => {
    const d1 = new Date(2026, 5, 22)
    const d2 = new Date(2026, 5, 22)
    expect(dailyChallenge(d1)).toEqual(dailyChallenge(d2))
  })

  test('daily challenge differs across days', () => {
    const a = dailyChallenge(new Date(2026, 5, 22))
    const b = dailyChallenge(new Date(2026, 5, 23))
    // Extremely unlikely to be identical; assert at least one field differs.
    const differs = a.start !== b.start || a.end !== b.end || a.step !== b.step
    expect(differs).toBe(true)
  })

  test('daily challenge answer is the correct sum', () => {
    const round = dailyChallenge(new Date(2026, 5, 22))
    expect(round.answer).toBe(
      calculateRangeStats(round.start, round.end, round.step).sum
    )
  })
})

describe('scoreRound', () => {
  test('incorrect answers score zero', () => {
    const r = scoreRound({ correct: false, timeRemaining: 10, timeLimit: 10, streak: 5, level: 1 })
    expect(r.points).toBe(0)
    expect(r.base).toBe(0)
  })

  test('correct answer with full time gets base + full speed bonus', () => {
    const r = scoreRound({ correct: true, timeRemaining: 30, timeLimit: 30, streak: 0, level: 1 })
    // level 1 multiplier = 1, base 100 + speed 100 + streak 0
    expect(r.base).toBe(BASE_POINTS)
    expect(r.speedBonus).toBe(100)
    expect(r.streakBonus).toBe(0)
    expect(r.points).toBe(200)
  })

  test('speed bonus scales with remaining time', () => {
    const half = scoreRound({ correct: true, timeRemaining: 15, timeLimit: 30, streak: 0, level: 1 })
    expect(half.speedBonus).toBe(50)
  })

  test('streak bonus is capped at the maximum', () => {
    const r = scoreRound({ correct: true, timeRemaining: 0, timeLimit: 30, streak: 100, level: 1 })
    expect(r.streakBonus).toBe(100)
  })

  test('higher levels apply a multiplier', () => {
    const lvl1 = scoreRound({ correct: true, timeRemaining: 30, timeLimit: 30, streak: 0, level: 1 })
    const lvl5 = scoreRound({ correct: true, timeRemaining: 30, timeLimit: 30, streak: 0, level: 5 })
    expect(lvl5.points).toBeGreaterThan(lvl1.points)
  })

  test('guards against a zero time limit', () => {
    const r = scoreRound({ correct: true, timeRemaining: 0, timeLimit: 0, streak: 0, level: 1 })
    expect(Number.isFinite(r.points)).toBe(true)
  })
})

describe('XP and player levels', () => {
  test('xpForPoints scales points down', () => {
    expect(xpForPoints(200)).toBe(20)
  })

  test('xpForPlayerLevel grows monotonically', () => {
    expect(xpForPlayerLevel(1)).toBe(0)
    expect(xpForPlayerLevel(2)).toBeGreaterThan(xpForPlayerLevel(1))
    expect(xpForPlayerLevel(3)).toBeGreaterThan(xpForPlayerLevel(2))
  })

  test('playerLevelForXp inverts the curve', () => {
    expect(playerLevelForXp(0)).toBe(1)
    expect(playerLevelForXp(xpForPlayerLevel(2))).toBe(2)
    expect(playerLevelForXp(xpForPlayerLevel(3))).toBe(3)
    // just below the next threshold stays on the current level
    expect(playerLevelForXp(xpForPlayerLevel(3) - 1)).toBe(2)
  })
})
