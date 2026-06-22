import { Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '@/utils/achievements';
import { useStatsStore } from '@/stores/stats';

export default function Achievements() {
  const unlocked = useStatsStore((s) => s.unlockedAchievements);
  const unlockedCount = unlocked.length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-black tracking-tighter italic text-white uppercase mb-2">
          ACHIEVEMENT <span className="text-sigma-primary">UNLOCK</span>
        </h2>
        <p className="text-sigma-primary/60 text-sm font-mono tracking-widest uppercase">
          {unlockedCount} / {ACHIEVEMENTS.length} Unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`glass p-6 rounded-2xl transition-all ${
                isUnlocked
                  ? 'border-sigma-primary/50 shadow-[0_0_24px_#fbbf2433]'
                  : 'opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 ${
                    isUnlocked ? 'bg-sigma-primary text-black' : 'bg-white/10 text-sigma-primary/50'
                  } rounded-none font-display font-black text-lg w-12 h-12 flex items-center justify-center`}
                >
                  {ach.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-black italic text-white uppercase">{ach.name}</h3>
                    {!isUnlocked && <Lock size={14} className="text-sigma-primary/50" />}
                  </div>
                  <p className="text-sm text-sigma-primary/60 font-mono">{ach.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
