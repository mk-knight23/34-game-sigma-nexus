import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { RangeCalculator } from '../components/RangeCalculator';

export default function Game() {
  return (
    <div>
      <header className="text-center mb-16 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
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

      <RangeCalculator />
    </div>
  );
}
