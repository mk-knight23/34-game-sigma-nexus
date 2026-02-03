import { useGameStore } from '@/stores/gameStore';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

export default function Stats() {
  const { scores, gamesPlayed, highScore } = useGameStore();

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-black tracking-tighter italic text-white uppercase mb-2">
          PERFORMANCE <span className="text-sigma-primary">METRICS</span>
        </h2>
        <p className="text-sigma-primary/60 text-sm font-mono tracking-widest uppercase">Your Game Statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-sigma-card border border-white/10 p-6 rounded-none">
          <div className="flex items-center gap-2 mb-2 text-sigma-primary">
            <BarChart3 size={20} />
            <span className="text-xs font-mono uppercase tracking-widest">Games</span>
          </div>
          <p className="text-3xl font-display font-black italic text-white">{gamesPlayed}</p>
        </div>
        <div className="bg-sigma-card border border-white/10 p-6 rounded-none">
          <div className="flex items-center gap-2 mb-2 text-sigma-primary">
            <TrendingUp size={20} />
            <span className="text-xs font-mono uppercase tracking-widest">High Score</span>
          </div>
          <p className="text-3xl font-display font-black italic text-white">{highScore}</p>
        </div>
        <div className="bg-sigma-card border border-white/10 p-6 rounded-none">
          <div className="flex items-center gap-2 mb-2 text-sigma-primary">
            <Target size={20} />
            <span className="text-xs font-mono uppercase tracking-widest">Average</span>
          </div>
          <p className="text-3xl font-display font-black italic text-white">{avgScore}</p>
        </div>
        <div className="bg-sigma-card border border-white/10 p-6 rounded-none">
          <div className="flex items-center gap-2 mb-2 text-sigma-primary">
            <Zap size={20} />
            <span className="text-xs font-mono uppercase tracking-widest">Total Score</span>
          </div>
          <p className="text-3xl font-display font-black italic text-white">{scores.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>

      <div className="bg-sigma-card border border-white/10 p-6 rounded-none">
        <h3 className="text-lg font-display font-black italic text-white uppercase mb-4">Recent Scores</h3>
        {scores.length > 0 ? (
          <div className="space-y-2">
            {scores.slice(-10).reverse().map((score, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/10">
                <span className="text-sm font-mono text-sigma-primary/80">Game #{gamesPlayed - scores.length + i + 1}</span>
                <span className="text-xl font-display font-black italic text-white">{score}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sigma-primary/60 py-8 font-mono">No games played yet</p>
        )}
      </div>
    </div>
  );
}
