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
            <div className="bg-sigma-primary p-2.5 rounded-none rotate-45 border border-sigma-primary/50 shadow-[0_0_15px_#f59e0b40]">
              <Activity className="text-black w-7 h-7 -rotate-45" />
            </div>
            <h1 className="text-2xl font-display font-black tracking-widest uppercase italic ml-2">
              SIGMA<span className="text-sigma-primary">_NEXUS</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleHelp()}
              className="p-3 rounded-none bg-sigma-card border border-white/10 text-slate-500 hover:text-sigma-primary hover:border-sigma-primary/50 transition-all"
            >
              <SettingsIcon size={20} />
            </button>
            <button
              onClick={() => { toggleDarkMode(); useSettingsStore.getState().applyTheme() }}
              className="p-3 rounded-none bg-sigma-card border border-white/10 text-slate-500 hover:text-sigma-primary hover:border-sigma-primary/50 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="https://github.com/mk-knight23/40-Range-Sum-Calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-none bg-sigma-card border border-white/10 text-slate-500 hover:text-sigma-primary hover:border-sigma-primary/50 transition-all"
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-sigma-primary/10 border border-sigma-primary/20 text-sigma-primary text-xs font-black uppercase tracking-widest">
              <TrendingUp size={14} className="fill-current" /> QUANTUM_ANALYSIS_CORE
            </span>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] italic text-white uppercase">
              SUMMATION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sigma-primary to-sigma-secondary">PROTOCOL</span>
            </h2>
            <p className="text-sigma-primary/60 max-w-xl mx-auto text-sm font-mono tracking-widest uppercase leading-relaxed">
              High-Precision Range Statistics // Algorithmic Visualization Engine
            </p>
          </motion.div>
        </header>

        <main>
          <RangeCalculator />
        </main>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
          {[
            { icon: <Activity className="text-sigma-primary" />, title: 'REAL-TIME STATS', desc: 'Instant summation, variance, and standard deviation telemetry.' },
            { icon: <Grid className="text-sigma-secondary" />, title: 'VISUAL MATRIX', desc: 'Rendered bar chart sequences for pattern recognition.' },
            { icon: <BarChart3 className="text-sigma-accent" />, title: 'MULTI-ALGORITHM', desc: 'Comparative analysis of iterative vs. constant-time logic.' }
          ].map((f, i) => (
            <div key={i} className="glass p-10 rounded-none space-y-6 hover:border-sigma-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-none bg-sigma-card border border-white/5 flex items-center justify-center group-hover:bg-sigma-primary/20 transition-colors">
                {f.icon}
              </div>
              <h4 className="text-2xl font-display font-black tracking-tight text-white uppercase italic">{f.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed font-mono text-xs">{f.desc}</p>
            </div>
          ))}
        </section>

        <footer className="mt-48 pb-12 border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="text-sigma-primary w-4 h-4" />
            <span className="font-display font-black uppercase text-xs tracking-[0.3em]">SIGMA_NEXUS // CORE v2.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-sigma-primary transition-colors">DOCUMENTATION</a>
            <a href="#" className="hover:text-sigma-primary transition-colors">SOURCE</a>
            <a href="#" className="hover:text-sigma-primary transition-colors">PRIVACY</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">&copy; 2026 Made by MK — Built by Musharraf Kazi</p>
        </footer>
      </div>
    </div>
  )
}
