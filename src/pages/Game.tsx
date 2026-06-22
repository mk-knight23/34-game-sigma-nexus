import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Gamepad2, Calculator } from 'lucide-react';
import { RangeCalculator } from '../components/RangeCalculator';
import { ChallengeMode } from '../components/ChallengeMode';

type View = 'challenge' | 'trainer';

export default function Game() {
  const [view, setView] = useState<View>('challenge');

  return (
    <div>
      <header className="text-center mb-10 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-sigma-primary/10 border border-sigma-primary/20 text-sigma-primary text-xs font-black uppercase tracking-widest">
            <TrendingUp size={14} className="fill-current" /> QUANTUM_ANALYSIS_CORE
          </span>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85] text-stone-50 uppercase text-glow">
            SUMMATION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sigma-primary via-sigma-secondary to-sigma-accent">PROTOCOL</span>
          </h2>
          <p className="text-sigma-primary/60 max-w-xl mx-auto text-sm font-mono tracking-widest uppercase leading-relaxed">
            Race the clock to sum the range // or explore the trainer
          </p>
        </motion.div>
      </header>

      {/* Mode switch */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex gap-1 glass p-1 rounded-2xl">
          {([
            { id: 'challenge', label: 'Challenge', icon: Gamepad2 },
            { id: 'trainer', label: 'Trainer', icon: Calculator },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  view === tab.id
                    ? 'bg-sigma-primary text-black shadow-[0_0_18px_#fbbf2455]'
                    : 'text-stone-400 hover:text-sigma-primary'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'challenge' ? <ChallengeMode /> : <RangeCalculator />}
    </div>
  );
}
