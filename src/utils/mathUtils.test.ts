import { describe, test, expect } from 'vitest'
import { calculateRangeStats, LANGUAGES } from './mathUtils'

describe('calculateRangeStats - range generation & sum', () => {
  test('sums 1 to 100 with step 1 (Gauss)', () => {
    const stats = calculateRangeStats(1, 100, 1)
    expect(stats.count).toBe(100)
    expect(stats.sum).toBe(5050)
    expect(stats.min).toBe(1)
    expect(stats.max).toBe(100)
    expect(stats.average).toBeCloseTo(50.5)
  })

  test('sums even numbers 2 to 10 with step 2', () => {
    const stats = calculateRangeStats(2, 10, 2)
    // 2 + 4 + 6 + 8 + 10
    expect(stats.count).toBe(5)
    expect(stats.sum).toBe(30)
    expect(stats.average).toBe(6)
  })

  test('handles a single-element range', () => {
    const stats = calculateRangeStats(5, 5, 1)
    expect(stats.count).toBe(1)
    expect(stats.sum).toBe(5)
    expect(stats.min).toBe(5)
    expect(stats.max).toBe(5)
    expect(stats.stdDev).toBe(0)
  })

  test('handles negative range crossing zero', () => {
    const stats = calculateRangeStats(-3, 3, 1)
    // -3,-2,-1,0,1,2,3 -> sum 0, count 7
    expect(stats.count).toBe(7)
    expect(stats.sum).toBe(0)
    expect(stats.min).toBe(-3)
    expect(stats.max).toBe(3)
    expect(stats.average).toBe(0)
  })

  test('descending range (start > end) counts down', () => {
    const stats = calculateRangeStats(10, 1, 1)
    // 10..1 -> still 10 terms, sum 55
    expect(stats.count).toBe(10)
    expect(stats.sum).toBe(55)
    expect(stats.min).toBe(1)
    expect(stats.max).toBe(10)
  })

  test('larger step that does not land exactly on end', () => {
    const stats = calculateRangeStats(1, 10, 3)
    // 1,4,7,10 -> count 4, sum 22
    expect(stats.count).toBe(4)
    expect(stats.sum).toBe(22)
  })

  test('all negative range', () => {
    const stats = calculateRangeStats(-5, -1, 1)
    // -5,-4,-3,-2,-1 -> sum -15
    expect(stats.count).toBe(5)
    expect(stats.sum).toBe(-15)
    expect(stats.min).toBe(-5)
    expect(stats.max).toBe(-1)
  })

  test('computes standard deviation correctly', () => {
    const stats = calculateRangeStats(1, 5, 1)
    // population variance of 1..5 = 2, stdDev = sqrt(2)
    expect(stats.stdDev).toBeCloseTo(Math.sqrt(2))
  })

  test('default step is 1 when omitted', () => {
    const stats = calculateRangeStats(1, 4)
    expect(stats.count).toBe(4)
    expect(stats.sum).toBe(10)
    expect(stats.step).toBe(1)
  })
})

describe('LANGUAGES code snippets', () => {
  test('produces a snippet for each language with usage values', () => {
    for (const lang of LANGUAGES) {
      const code = lang.code(1, 10, 1)
      expect(typeof code).toBe('string')
      expect(code.length).toBeGreaterThan(0)
    }
  })

  test('optimized formula snippet embeds the correct result', () => {
    const formula = LANGUAGES.find((l) => l.name.startsWith('Formula'))!
    const code = formula.code(1, 100, 1)
    expect(code).toContain('5050')
  })
})
