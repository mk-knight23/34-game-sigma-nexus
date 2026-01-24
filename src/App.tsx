import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/settings'
import {
  Activity,
  Moon,
  Sun,
  Github,
  TrendingUp,
  Grid,
  Zap,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react'
import { RangeCalculator } from './components/RangeCalculator'
import { SettingsPanel } from './components/SettingsPanel'

export default function App() {
  const { isDarkMode, toggleDarkMode, toggleHelp } = useSettingsStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <SettingsPanel onClose={() => toggleHelp()} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-3">
            <div className="bg-range-primary p-2.5 rounded-2xl shadow-lg shadow-range-primary/30">
              <Activity className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-display font-black tracking-tight">
              Range<span className="text-range-primary font-light italic">Sync</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleHelp()}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-range-primary transition-all"
            >
              <SettingsIcon size={20} />
            </button>
            <button
              onClick={() => { toggleDarkMode(); useSettingsStore.getState().applyTheme() }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-range-primary transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="https://github.com/mk-knight23/40-Range-Sum-Calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-range-primary transition-all"
            >
              <Github size={20} />
            </a>
          </div>
        </nav>

        <header className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-range-primary/10 text-range-primary text-xs font-black uppercase tracking-widest">
              <TrendingUp size={14} className="fill-current" /> Numerical Intelligence
            </span>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] italic">
              Analyze Your <br />
              <span className="text-range-primary underline decoration-8 decoration-range-primary/10">Sequences</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-medium leading-relaxed">
              The professional environment for range calculations, statistical analysis, and algorithmic visualization.
            </p>
          </motion.div>
        </header>

        <main>
          <RangeCalculator />
        </main>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
          {[
            { icon: <Activity className="text-range-primary" />, title: 'Real-time Stats', desc: 'Instant calculation of sum, average, variance and standard deviation.' },
            { icon: <Grid className="text-range-secondary" />, title: 'Visual Analysis', desc: 'Beautifully rendered bar charts representing your numerical sequence.' },
            { icon: <BarChart3 className="text-range-accent" />, title: 'Multi-Algorithm', desc: 'Compare iterative loops with constant-time mathematical formulas.' }
          ].map((f, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {f.icon}
              </div>
              <h4 className="text-2xl font-display font-black tracking-tight">{f.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        <footer className="mt-48 pb-12 border-t border-slate-200 dark:border-slate-800 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-range-primary w-5 h-5" />
            <span className="font-display font-black uppercase text-sm tracking-widest text-slate-500">RangeSync v1.0.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-range-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-range-primary transition-colors">Open Source</a>
            <a href="#" className="hover:text-range-primary transition-colors">Privacy</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">&copy; 2026 MK-MATHLAB. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  )
}
