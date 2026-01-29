import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings as SettingsIcon,
  History,
  Info,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Flame,
  Trophy,
  Keyboard
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useRangeStore } from '@/stores/rangeStore'
import { calculateRangeStats, LANGUAGES } from '@/utils/mathUtils'

// Quick preset ranges for common calculations
const PRESETS = [
  { name: '1 to 100', start: 1, end: 100, step: 1, description: 'Sum of first 100 natural numbers' },
  { name: '1 to 1000', start: 1, end: 1000, step: 1, description: 'Sum of first 1000 natural numbers' },
  { name: 'Even Numbers', start: 2, end: 100, step: 2, description: 'Sum of even numbers 2-100' },
  { name: 'Odd Numbers', start: 1, end: 99, step: 2, description: 'Sum of odd numbers 1-99' },
  { name: 'Countdown', start: 10, end: 1, step: -1, description: 'Countdown from 10 to 1' },
  { name: 'Decimals', start: 0, end: 1, step: 0.1, description: 'Decimals from 0 to 1' }
]

// Simple syntax highlighting for code snippets
function highlightSyntax(code: string): string {
  let html = code

  // Escape HTML first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Keywords
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'def', 'class', 'import', 'from', 'public', 'static', 'int', 'void']
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g')
    html = html.replace(regex, '<span class="text-purple-500">$1</span>')
  })

  // Built-in functions and methods
  const builtins = ['Math.floor', 'Math.sqrt', 'Math.pow', 'Math.abs', 'sum', 'range', 'print', 'console.log', 'len']
  builtins.forEach(bi => {
    const regex = new RegExp(`\\b(${bi.replace('.', '\\.')})\\b`, 'g')
    html = html.replace(regex, '<span class="text-blue-500">$1</span>')
  })

  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-500">$1</span>')

  // Strings
  html = html.replace(/'([^']*)'/g, '<span class="text-green-600">\'$1\'</span>')
  html = html.replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>')

  // Comments
  html = html.replace(/(\/\/.*)/g, '<span class="text-slate-400">$1</span>')
  html = html.replace(/(#.*)/g, '<span class="text-slate-400">$1</span>')

  return html
}

export function RangeCalculator() {
  const { start, end, step, setRange, addHistory, history, clearHistory } = useRangeStore()
  const [localRange, setLocalRange] = useState({ start, end, step })
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual')
  const [copiedLang, setCopiedLang] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  
  // V2: Session engagement tracking
  const [streak, setStreak] = useState(0)
  const [sessionBest, setSessionBest] = useState(0)
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)
  const [keyboardHint, setKeyboardHint] = useState(true)

  // Load session best from storage
  useEffect(() => {
    const saved = sessionStorage.getItem('rangeSync_best')
    if (saved) setSessionBest(parseInt(saved, 10))
  }, [])

  // Hide keyboard hint after first interaction
  useEffect(() => {
    if (history.length > 0) {
      setKeyboardHint(false)
    }
  }, [history.length])

  const stats = useMemo(() => {
    return calculateRangeStats(localRange.start, localRange.end, localRange.step)
  }, [localRange])

  const chartData = useMemo(() => {
    // Generate up to 50 points for visualization
    const data = []
    const actualStep = Math.max(0.0001, localRange.step)
    const isForward = localRange.start <= localRange.end
    
    let count = 0
    if (isForward) {
      for (let i = localRange.start; i <= localRange.end && count < 50; i += actualStep) {
        data.push({ val: i })
        count++
      }
    } else {
      for (let i = localRange.start; i >= localRange.end && count < 50; i -= actualStep) {
        data.push({ val: i })
        count++
      }
    }
    return data
  }, [localRange])

  const handleApply = useCallback(() => {
    // Clear previous warning
    setWarning(null)

    // Validate range size
    const estimatedCount = Math.abs(Math.floor((localRange.end - localRange.start) / localRange.step)) + 1
    const MAX_SAFE_COUNT = 1000000

    if (estimatedCount > MAX_SAFE_COUNT) {
      setWarning(`This range contains approximately ${estimatedCount.toLocaleString()} numbers. Large ranges may cause performance issues. Consider using a larger step or smaller range.`)
      return
    }

    // Validate step direction
    if (localRange.start < localRange.end && localRange.step < 0) {
      setWarning('Step value is negative but start < end. The loop will not execute.')
      return
    }

    if (localRange.start > localRange.end && localRange.step > 0) {
      setWarning('Step value is positive but start > end. The loop will not execute.')
      return
    }

    // Warn about very small steps with large ranges
    if (localRange.step < 0.001 && estimatedCount > 10000) {
      setWarning(`Very small step (${localRange.step}) with large range may cause precision issues. Results may be inaccurate.`)
      return
    }

    setRange(localRange.start, localRange.end, localRange.step)
    addHistory(stats)
    
    // V2: Update streak on successful calculation
    setStreak(prev => {
      const newStreak = prev + 1
      if (newStreak > sessionBest) {
        setSessionBest(newStreak)
        sessionStorage.setItem('rangeSync_best', newStreak.toString())
      }
      // Trigger animation for milestones
      if (newStreak % 5 === 0) {
        setShowStreakAnimation(true)
        setTimeout(() => setShowStreakAnimation(false), 2000)
      }
      return newStreak
    })
  }, [localRange, stats, sessionBest, setRange, addHistory])

  // Keyboard shortcuts for power users - defined after handleApply
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleApply()
      }
      if (e.key === 'Escape') {
        setWarning(null)
      }
      if (e.key === '?' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setKeyboardHint(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleApply])

  const handleCopy = (code: string, langName: string) => {
    navigator.clipboard.writeText(code)
    setCopiedLang(langName)
    setTimeout(() => setCopiedLang(null), 2000)
  }

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setLocalRange({ start: preset.start, end: preset.end, step: preset.step })
    setWarning(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-6 shadow-xl">
          <h3 className="font-display text-xl font-black flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-range-primary" /> Parameters
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Start Value</label>
              <input 
                type="number"
                value={localRange.start}
                onChange={e => setLocalRange(prev => ({ ...prev, start: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">End Value</label>
              <input 
                type="number"
                value={localRange.end}
                onChange={e => setLocalRange(prev => ({ ...prev, end: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Step Increment</label>
              <input 
                type="number"
                step="0.1"
                min="0.0001"
                value={localRange.step}
                onChange={e => setLocalRange(prev => ({ ...prev, step: parseFloat(e.target.value) || 1 }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-range-primary transition-all font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-range-primary hover:bg-range-primary/90 text-white font-black p-4 rounded-2xl shadow-lg shadow-range-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 group relative"
          >
            <Zap size={18} className="group-hover:animate-pulse" /> 
            CALCULATE RANGE
            <span className="absolute right-4 text-[10px] opacity-50 font-medium hidden md:block">
              ⌘↵
            </span>
          </button>

          {/* V2: Keyboard shortcuts hint - Accessibility improvement */}
          <AnimatePresence>
            {keyboardHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl flex items-start gap-2"
              >
                <Keyboard size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="font-bold">Pro tip:</span> Press 
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-mono mx-1">⌘</kbd>+
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-mono">Enter</kbd> 
                  to calculate. Press 
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-mono mx-1">?</kbd> 
                  for help.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning Display */}
          <AnimatePresence>
            {warning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3"
              >
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">{warning}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Presets */}
        <div className="glass p-6 rounded-[2.5rem] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-range-accent" size={16} />
            <h3 className="font-display text-sm font-black uppercase text-slate-400 tracking-widest">Quick Presets</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-range-primary/10 rounded-xl text-left transition-all group"
                title={preset.description}
              >
                <Bookmark size={12} className="text-range-primary mb-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{preset.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{preset.start} → {preset.end}</p>
              </button>
            ))}
          </div>
        </div>

        {/* V2: Session Stats - Human touch with streak tracking */}
        <div className="glass p-6 rounded-[2.5rem] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
              <Flame className="w-4 h-4 text-orange-500" /> This Session
            </h3>
            {streak > 0 && (
              <button 
                onClick={() => setStreak(0)} 
                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                title="Reset streak"
              >
                reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl text-center relative overflow-hidden">
              <AnimatePresence>
                {showStreakAnimation && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 1, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-orange-500/10"
                  >
                    <Flame className="w-8 h-8 text-orange-500" />
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Streak</p>
              <p className={`text-2xl font-black ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`}>
                {streak}
              </p>
              {streak >= 10 && <span className="text-[8px] text-orange-500 font-bold uppercase">On fire!</span>}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-center gap-1">
                <Trophy size={10} /> Best
              </p>
              <p className="text-2xl font-black text-range-primary">{sessionBest}</p>
              {sessionBest >= 20 && <span className="text-[8px] text-range-primary font-bold uppercase">Power user</span>}
            </div>
          </div>
          {streak === 0 && history.length === 0 && (
            <p className="text-[10px] text-slate-400 text-center italic">
              Calculate to start your streak
            </p>
          )}
        </div>

        {/* History */}
        <div className="glass p-8 rounded-[2.5rem] space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-black flex items-center gap-2">
              <History className="w-5 h-5 text-range-secondary" /> History
            </h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-red-500 hover:underline text-[10px] font-black uppercase">Wipe</button>
            )}
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {history.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group">
                <span className="text-xs font-mono font-bold text-slate-500">{h.stats.start} → {h.stats.end}</span>
                <span className="text-xs font-black text-range-primary">∑ {h.stats.sum.toLocaleString()}</span>
              </div>
            ))}
            {history.length === 0 && <p className="text-center text-slate-400 text-xs py-4 font-bold uppercase tracking-widest">Calculations appear here</p>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sum', val: stats.sum.toLocaleString(), color: 'text-range-primary' },
            { label: 'Count', val: stats.count, color: 'text-range-secondary' },
            { label: 'Average', val: stats.average.toFixed(2), color: 'text-range-accent' },
            { label: 'Std Dev', val: stats.stdDev.toFixed(2), color: 'text-slate-500' }
          ].map((s, i) => (
            <div key={i} className="glass p-6 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
              <p className={clsx("text-xl font-black truncate", s.color)}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div className="glass rounded-[3rem] overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('visual')}
              className={clsx(
                "flex-1 p-6 font-black text-xs uppercase tracking-[0.2em] transition-all",
                activeTab === 'visual' ? "bg-white dark:bg-slate-800 text-range-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Sequence Visualizer
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={clsx(
                "flex-1 p-6 font-black text-xs uppercase tracking-[0.2em] transition-all",
                activeTab === 'code' ? "bg-white dark:bg-slate-800 text-range-secondary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Algorithm Snippets
            </button>
          </div>

          <div className="p-8 flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'visual' ? (
                <motion.div 
                  key="visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full space-y-8"
                >
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="val" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="glass px-4 py-2 rounded-xl text-xs font-bold border-range-primary/20">
                                  Value: {payload[0].value}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold flex items-center gap-2"><Info size={16} className="text-range-primary" /> Visual Insights</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Showing the first 50 numbers in the sequence. The sum ∑ from {localRange.start} to {localRange.end} with a step of {localRange.step} is calculated by adding each individual term.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {LANGUAGES.map(lang => (
                    <div key={lang.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-black uppercase text-slate-400 tracking-widest">{lang.name}</h5>
                        <button
                          onClick={() => handleCopy(lang.code(localRange.start, localRange.end, localRange.step), lang.name)}
                          className="text-range-secondary p-1 hover:bg-range-secondary/10 rounded transition-colors"
                          title="Copy code"
                        >
                          {copiedLang === lang.name ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs leading-relaxed"><code dangerouslySetInnerHTML={{
                        __html: highlightSyntax(lang.code(localRange.start, localRange.end, localRange.step))
                      }} /></pre>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
