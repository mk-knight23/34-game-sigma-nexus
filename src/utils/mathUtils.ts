import type { RangeStats } from '../types/range'

export function calculateRangeStats(start: number, end: number, step: number = 1): RangeStats {
  const actualStep = Math.max(0.0001, step)
  const sequence: number[] = []
  
  if (start <= end) {
    for (let i = start; i <= end; i += actualStep) {
      sequence.push(i)
    }
  } else {
    for (let i = start; i >= end; i -= actualStep) {
      sequence.push(i)
    }
  }

  const count = sequence.length
  const sum = sequence.reduce((a, b) => a + b, 0)
  const average = count > 0 ? sum / count : 0
  const min = Math.min(...sequence)
  const max = Math.max(...sequence)
  
  const variance = count > 0 ? sequence.reduce((a, b) => a + Math.pow(b - average, 2), 0) / count : 0
  const stdDev = Math.sqrt(variance)

  return {
    start,
    end,
    step: actualStep,
    count,
    sum,
    average,
    min,
    max,
    stdDev
  }
}

export const LANGUAGES = [
  {
    name: 'JavaScript',
    code: (s: number, e: number) => `const sum = (s, e) => {
  let total = 0;
  for (let i = ${s}; i <= ${e}; i++) total += i;
  return total;
};`
  },
  {
    name: 'Python',
    code: (s: number, e: number) => `def range_sum(s, e):
    return sum(range(${s}, ${e} + 1))`
  },
  {
    name: 'Java',
    code: (s: number, e: number) => `// Summing from ${s} to ${e}
public int rangeSum() {
    int total = 0;
    for (int i = ${s}; i <= ${e}; i++) total += i;
    return total;
}`
  },
  {
    name: 'C++',
    code: (s: number, e: number) => `// Summing from ${s} to ${e}
int rangeSum() {
    int total = 0;
    for (int i = ${s}; i <= ${e}; i++) total += i;
    return total;
}`
  }
]
