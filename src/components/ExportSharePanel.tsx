/**
 * Export & Share Component
 * Provides export to CSV/PDF and shareable link functionality
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, 
  Printer, 
  FileSpreadsheet,
  Check,
  Copy
} from 'lucide-react'
import { useRangeStore } from '@/stores/rangeStore'
import { 
  downloadCSV, 
  printReport, 
  copyShareableLink,
  generateShareableLink 
} from '@/utils/exportUtils'
import type { RangeStats } from '@/types/range'

interface ExportSharePanelProps {
  stats: RangeStats
  currentStart: number
  currentEnd: number
  currentStep: number
}

export function ExportSharePanel({ stats, currentStart, currentEnd, currentStep }: ExportSharePanelProps) {
  const { history } = useRangeStore()
  const [copied, setCopied] = useState(false)
  const [showLink, setShowLink] = useState(false)

  const handleCopyLink = async () => {
    const success = await copyShareableLink(currentStart, currentEnd, currentStep)
    if (success) {
      setCopied(true)
      setShowLink(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareableLink = generateShareableLink(currentStart, currentEnd, currentStep)

  const exportOptions = [
    {
      id: 'csv',
      name: 'Export CSV',
      description: 'Download as spreadsheet file',
      icon: FileSpreadsheet,
      action: () => downloadCSV(stats, history),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'print',
      name: 'Print Report',
      description: 'Generate printable PDF report',
      icon: Printer,
      action: () => printReport(stats, history),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'share',
      name: 'Share Link',
      description: 'Copy shareable URL',
      icon: Share2,
      action: handleCopyLink,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Share2 className="text-range-secondary" size={16} />
        <h3 className="font-display text-sm font-black uppercase text-slate-400 tracking-widest">
          Export & Share
        </h3>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 gap-2">
        {exportOptions.map((option) => {
          const Icon = option.icon
          return (
            <motion.button
              key={option.id}
              onClick={option.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }
              }
              className={`
                ${option.bgColor} p-4 rounded-xl text-left transition-all
                hover:shadow-lg hover:shadow-black/5
                flex items-center gap-3 group
              `}
            >
              <div className={`
                ${option.bgColor} p-2 rounded-lg
                group-hover:scale-110 transition-transform
              `}>
                <Icon size={18} className={option.color} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">
                  {option.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {option.description}
                </p>
              </div>
              {option.id === 'share' && copied && (
                <Check size={16} className="text-green-500" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Shareable Link Display */}
      {showLink && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass p-3 rounded-xl space-y-2"
        >
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Shareable Link
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareableLink}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-mono text-slate-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 bg-range-primary hover:bg-range-primary/90 text-white rounded-lg transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[9px] text-slate-400">
            Anyone with this link can view your range configuration
          </p>
        </motion.div>
      )}

      {/* Export Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
          Export Details
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-slate-400">Format:</span>
            <span className="ml-1 font-mono text-slate-600 dark:text-slate-300">CSV</span>
          </div>
          <div>
            <span className="text-slate-400">History:</span>
            <span className="ml-1 font-mono text-slate-600 dark:text-slate-300">{history.length} entries</span>
          </div>
        </div>
      </div>
    </div>
  )
}
