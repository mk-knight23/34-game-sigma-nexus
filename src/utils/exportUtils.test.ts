import { describe, test, expect, beforeEach, vi } from 'vitest'
import {
  exportToCSV,
  generateShareableLink,
  parseRangeFromURL,
  generatePrintableReport,
} from './exportUtils'
import type { RangeStats, RangeHistory } from '@/types/range'

const stats: RangeStats = {
  start: 1,
  end: 100,
  step: 1,
  count: 100,
  sum: 5050,
  average: 50.5,
  min: 1,
  max: 100,
  stdDev: 28.86,
}

describe('exportToCSV', () => {
  test('produces a header row and one row per metric', () => {
    const csv = exportToCSV(stats)
    const lines = csv.split('\n')
    expect(lines[0]).toBe('Metric,Value')
    expect(csv).toContain('Sum,5050')
    expect(csv).toContain('Count,100')
    expect(csv).toContain('Start,1')
  })

  test('appends a history section when history is provided', () => {
    const history: RangeHistory[] = [
      { id: 'a', timestamp: '2024-01-01T00:00:00Z', stats },
    ]
    const csv = exportToCSV(stats, history)
    expect(csv).toContain('History')
    expect(csv).toContain('2024-01-01T00:00:00Z')
  })

  test('omits history section when history is empty', () => {
    const csv = exportToCSV(stats, [])
    expect(csv).not.toContain('Timestamp,Start,End')
  })
})

describe('shareable link round-trip', () => {
  beforeEach(() => {
    // jsdom provides window.location; reset search before each test.
    window.history.pushState({}, '', '/')
  })

  test('generateShareableLink encodes start, end, step', () => {
    const link = generateShareableLink(5, 50, 5)
    expect(link).toContain('s=5')
    expect(link).toContain('e=50')
    expect(link).toContain('t=5')
  })

  test('parseRangeFromURL decodes parameters set on the URL', () => {
    window.history.pushState({}, '', '/?s=5&e=50&t=5')
    const parsed = parseRangeFromURL()
    expect(parsed).toEqual({ start: 5, end: 50, step: 5 })
  })

  test('parseRangeFromURL returns null when params are absent', () => {
    window.history.pushState({}, '', '/')
    expect(parseRangeFromURL()).toBeNull()
  })

  test('parseRangeFromURL returns null on non-numeric params', () => {
    window.history.pushState({}, '', '/?s=abc&e=def&t=ghi')
    expect(parseRangeFromURL()).toBeNull()
  })
})

describe('generatePrintableReport', () => {
  test('embeds key stats into HTML', () => {
    const html = generatePrintableReport(stats)
    expect(html).toContain('Range Statistics Report')
    expect(html).toContain('5,050') // sum is toLocaleString'd
    expect(html).toContain('<html>')
  })
})

describe('clipboard share', () => {
  test('copyShareableLink resolves true when clipboard succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const { copyShareableLink } = await import('./exportUtils')
    const ok = await copyShareableLink(1, 10, 1)
    expect(ok).toBe(true)
    expect(writeText).toHaveBeenCalledOnce()
  })
})
