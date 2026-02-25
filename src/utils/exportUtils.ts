/**
 * Export utilities for Sigma Nexus
 */

import type { RangeStats, RangeHistory } from '@/types/range'

/**
 * Export range statistics to CSV format
 */
export function exportToCSV(stats: RangeStats, history?: RangeHistory[]): string {
  const headers = ['Metric', 'Value']
  const rows = [
    ['Start', stats.start.toString()],
    ['End', stats.end.toString()],
    ['Step', stats.step.toString()],
    ['Count', stats.count.toString()],
    ['Sum', stats.sum.toString()],
    ['Average', stats.average.toString()],
    ['Min', stats.min.toString()],
    ['Max', stats.max.toString()],
    ['Std Dev', stats.stdDev.toString()],
  ]

  let csv = headers.join(',') + '\n'
  csv += rows.map(row => row.join(',')).join('\n')

  if (history && history.length > 0) {
    csv += '\n\nHistory\n'
    csv += 'Timestamp,Start,End,Step,Sum,Count,Average\n'
    history.forEach(h => {
      csv += `${h.timestamp},${h.stats.start},${h.stats.end},${h.stats.step},${h.stats.sum},${h.stats.count},${h.stats.average}\n`
    })
  }

  return csv
}

/**
 * Download CSV file
 */
export function downloadCSV(stats: RangeStats, history?: RangeHistory[], filename?: string): void {
  const csv = exportToCSV(stats, history)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename || `range-stats-${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate shareable URL with encoded range parameters
 */
export function generateShareableLink(start: number, end: number, step: number): string {
  const params = new URLSearchParams({
    s: start.toString(),
    e: end.toString(),
    t: step.toString()
  })
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
  return url
}

/**
 * Parse range from URL parameters
 */
export function parseRangeFromURL(): { start: number; end: number; step: number } | null {
  const params = new URLSearchParams(window.location.search)
  const s = params.get('s')
  const e = params.get('e')
  const t = params.get('t')

  if (s && e && t) {
    const start = parseFloat(s)
    const end = parseFloat(e)
    const step = parseFloat(t)

    if (!isNaN(start) && !isNaN(end) && !isNaN(step)) {
      return { start, end, step }
    }
  }

  return null
}

/**
 * Copy shareable link to clipboard
 */
export async function copyShareableLink(start: number, end: number, step: number): Promise<boolean> {
  try {
    const link = generateShareableLink(start, end, step)
    await navigator.clipboard.writeText(link)
    return true
  } catch (err) {
    console.error('Failed to copy link:', err)
    return false
  }
}

/**
 * Generate printable report HTML
 */
export function generatePrintableReport(stats: RangeStats, history?: RangeHistory[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Range Statistics Report</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
    .stat-card { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    .stat-label { font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; }
    .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #10b981; color: white; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Range Statistics Report</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Start</div>
      <div class="stat-value">${stats.start}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">End</div>
      <div class="stat-value">${stats.end}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Step</div>
      <div class="stat-value">${stats.step}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Count</div>
      <div class="stat-value">${stats.count}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Sum</div>
      <div class="stat-value">${stats.sum.toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Average</div>
      <div class="stat-value">${stats.average.toFixed(4)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Min</div>
      <div class="stat-value">${stats.min}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Max</div>
      <div class="stat-value">${stats.max}</div>
    </div>
    <div class="stat-card" style="grid-column: span 2;">
      <div class="stat-label">Standard Deviation</div>
      <div class="stat-value">${stats.stdDev.toFixed(4)}</div>
    </div>
  </div>

  ${history && history.length > 0 ? `
  <h2>Calculation History</h2>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Range</th>
        <th>Sum</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      ${history.map(h => `
        <tr>
          <td>${new Date(h.timestamp).toLocaleString()}</td>
          <td>${h.stats.start} → ${h.stats.end}</td>
          <td>${h.stats.sum.toLocaleString()}</td>
          <td>${h.stats.count}</td>
        </tr>
      `).join('')}\n    </tbody>\n  </table>\n  ` : ''}

  <div class="footer">
    Generated by Sigma Nexus - Range Summation Calculator
  </div>
</body>
</html>
  `
}

/**
 * Print report
 */
export function printReport(stats: RangeStats, history?: RangeHistory[]): void {
  const html = generatePrintableReport(stats, history)
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }
}
