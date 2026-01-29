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
    code: (s: number, e: number, step: number = 1) => `const sum = (start, end, step = 1) => {
  let total = 0;
  for (let i = start; i <= end; i += step) total += i;
  return total;
};

// Usage: sum(${s}, ${e}${step !== 1 ? `, ${step}` : ''})`
  },
  {
    name: 'Python',
    code: (s: number, e: number, step: number = 1) => `def range_sum(start, end, step=1):
    return sum(range(start, end + (1 if step > 0 else -1), step))

# Usage: range_sum(${s}, ${e}${step !== 1 ? `, ${step}` : ''})`
  },
  {
    name: 'Java',
    code: (s: number, e: number, step: number = 1) => `// Summing from ${s} to ${e}${step !== 1 ? ` (step: ${step})` : ''}
public static int rangeSum(int start, int end, int step) {
    int total = 0;
    if (step > 0) {
        for (int i = start; i <= end; i += step) total += i;
    } else {
        for (int i = start; i >= end; i += step) total += i;
    }
    return total;
}`
  },
  {
    name: 'C++',
    code: (s: number, e: number, step: number = 1) => `// Summing from ${s} to ${e}${step !== 1 ? ` (step: ${step})` : ''}
int rangeSum(int start, int end, int step) {
    int total = 0;
    if (step > 0) {
        for (int i = start; i <= end; i += step) total += i;
    } else {
        for (int i = start; i >= end; i += step) total += i;
    }
    return total;
}`
  },
  {
    name: 'Formula (Optimized)',
    code: (s: number, e: number, step: number = 1) => `// Arithmetic Series Formula: S = n/2 × (a₁ + aₙ)
// Where n = count, a₁ = start, aₙ = end
function arithmeticSeriesSum(start, end, step = 1) {
    const count = Math.floor((end - start) / step) + 1;
    const lastTerm = start + (count - 1) * step;
    return (count / 2) * (start + lastTerm);
}

// Result: ${(Math.floor((e - s) / step) + 1) / 2} * (${s} + ${s + (Math.floor((e - s) / step)) * step})
// = ${calculateRangeStats(s, e, step).sum}`
  }
]
