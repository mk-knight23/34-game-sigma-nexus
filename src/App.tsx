import { Outlet, Link, NavLink, useLocation } from 'react-router';
import { useSettingsStore } from '@/stores/settings';
import { Activity, Moon, Sun, Github, BarChart3, Award, Settings as SettingsIcon } from 'lucide-react';
import { SettingsPanel } from './components/SettingsPanel';
import { CinematicBackground } from './components/CinematicBackground';

export default function App() {
  const { isDarkMode, toggleDarkMode, toggleHelp } = useSettingsStore();
  const location = useLocation();
  // The game (with its live Recharts chart) lives at "/", so it always uses the
  // static-image variant — video is never run behind heavy interactive charts.
  // The lighter stats/achievements routes get the cinematic video on desktop.
  const bgVariant = location.pathname === '/' ? 'game' : 'hero';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <CinematicBackground variant={bgVariant} />
      <SettingsPanel onClose={() => toggleHelp()} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-sigma-primary p-2.5 rounded-none rotate-45 border border-sigma-primary/50 shadow-[0_0_20px_#fbbf2466]">
              <Activity className="text-black w-7 h-7 -rotate-45" />
            </div>
            <h1 className="text-2xl font-display font-black tracking-widest uppercase ml-2 text-stone-100">
              SIGMA<span className="text-sigma-primary text-glow">_NEXUS</span>
            </h1>
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/" className="nav-link">Play</NavLink>
            <NavLink to="/stats" className="nav-link"><BarChart3 size={16} /></NavLink>
            <NavLink to="/achievements" className="nav-link"><Award size={16} /></NavLink>
            <button onClick={() => toggleHelp()} className="nav-link"><SettingsIcon size={16} /></button>
            <button onClick={() => { toggleDarkMode(); useSettingsStore.getState().applyTheme() }} className="nav-link">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/mk-knight23/40-Range-Sum-Calculator" target="_blank" rel="noopener noreferrer" className="nav-link">
              <Github size={16} />
            </a>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
