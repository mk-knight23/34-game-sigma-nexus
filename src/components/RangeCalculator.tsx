import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  History, 
  Info,
  Zap,
  Copy
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

export function RangeCalculator() {
  const { start, end, step, setRange, addHistory, history, clearHistory } = useRangeStore()
  const [localRange, setLocalRange] = useState({ start, end, step })
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual')

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

  const handleApply = () => {
    setRange(localRange.start, localRange.end, localRange.step)
    addHistory(stats)
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
            className="w-full bg-range-primary hover:bg-range-primary/90 text-white font-black p-4 rounded-2xl shadow-lg shadow-range-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Zap size={18} /> CALCULATE RANGE
          </button>
        </div>

        {/* History */}
        <div className="glass p-8 rounded-[2.5rem] space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-black flex items-center gap-2">
              <History className="w-5 h-5 text-range-secondary" /> History
            </h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-red-500 hover:underline text-[10px] font-black uppercase">Clear</button>
            )}
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {history.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group">
                <span className="text-xs font-mono font-bold text-slate-500">{h.stats.start} → {h.stats.end}</span>
                <span className="text-xs font-black text-range-primary">∑ {h.stats.sum.toLocaleString()}</span>
              </div>
            ))}
            {history.length === 0 && <p className="text-center text-slate-400 text-xs py-4 font-bold uppercase tracking-widest">No history yet</p>}
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
                        <button className="text-range-secondary p-1 hover:bg-range-secondary/10 rounded transition-colors"><Copy size={14} /></button>
                      </div>
                      <pre><code>{lang.code(localRange.start, localRange.end)}</code></pre>
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
