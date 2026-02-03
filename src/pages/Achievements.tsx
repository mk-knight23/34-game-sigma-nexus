import { Award, Lock, Trophy, Star, Zap } from 'lucide-react';

const achievements = [
  { id: 'first-game', name: 'First Steps', desc: 'Play your first game', icon: <Zap size={24} />, unlocked: true },
  { id: 'score-100', name: 'Century', desc: 'Score 100 points', icon: <Star size={24} />, unlocked: false },
  { id: 'score-500', name: 'High Scorer', desc: 'Score 500 points', icon: <Trophy size={24} />, unlocked: false },
  { id: 'games-10', name: 'Dedicated', desc: 'Play 10 games', icon: <Award size={24} />, unlocked: false },
];

export default function Achievements() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-black tracking-tighter italic text-white uppercase mb-2">
          ACHIEVEMENT <span className="text-sigma-primary">UNLOCK</span>
        </h2>
        <p className="text-sigma-primary/60 text-sm font-mono tracking-widest uppercase">Track Your Progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`bg-sigma-card border p-6 rounded-none transition-all ${
              ach.unlocked
                ? 'border-sigma-primary/50 shadow-[0_0_20px_#f59e0b30]'
                : 'border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 ${ach.unlocked ? 'bg-sigma-primary text-black' : 'bg-white/10 text-sigma-primary/50'} rounded-none`}>
                {ach.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-black italic text-white uppercase">{ach.name}</h3>
                  {!ach.unlocked && <Lock size={14} className="text-sigma-primary/50" />}
                </div>
                <p className="text-sm text-sigma-primary/60 font-mono">{ach.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
