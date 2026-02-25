/**
 * Favorites Panel Component
 * Allows users to save, load, and manage favorite range configurations
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Trash2, 
  Download, 
  Heart
} from 'lucide-react'
import { useRangeStore } from '@/stores/rangeStore'
import type { FavoriteRange } from '@/types/range'

interface FavoritesPanelProps {
  currentStart: number
  currentEnd: number
  currentStep: number
  onLoad: (start: number, end: number, step: number) => void
}

export function FavoritesPanel({ currentStart, currentEnd, currentStep, onLoad }: FavoritesPanelProps) {
  const { favorites, addFavorite, removeFavorite } = useRangeStore()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')

  const handleAddFavorite = () => {
    if (!favoriteName.trim()) return
    addFavorite(favoriteName, currentStart, currentEnd, currentStep)
    setFavoriteName('')
    setShowAddDialog(false)
  }

  const isAlreadyFavorited = favorites.some(
    f => f.start === currentStart && f.end === currentEnd && f.step === currentStep
  )

  const handleLoadFavorite = (fav: FavoriteRange) => {
    onLoad(fav.start, fav.end, fav.step)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={16} />
          <h3 className="font-display text-sm font-black uppercase text-slate-400 tracking-widest">
            Favorites
          </h3>
          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 font-bold">
            {favorites.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddDialog(!showAddDialog)}
          disabled={isAlreadyFavorited}
          className={`
            p-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider
            ${isAlreadyFavorited 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 text-white'
            }
          `}
          title={isAlreadyFavorited ? 'Already in favorites' : 'Add to favorites'}
        >
          {isAlreadyFavorited ? <Star size={16} className="fill-current" /> : <Star size={16} />}
        </button>
      </div>

      {/* Add Favorite Dialog */}
      <AnimatePresence>
        {showAddDialog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass p-4 rounded-xl space-y-3"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Favorite Name</label>
              <input
                type="text"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="e.g., Fibonacci Range"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFavorite()
                  if (e.key === 'Escape') setShowAddDialog(false)
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddFavorite}
                disabled={!favoriteName.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black py-2 rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddDialog(false)
                  setFavoriteName('')
                }}
                className="px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-black rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence>
          {favorites.map((fav, index) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-3 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              onClick={() => handleLoadFavorite(fav)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">{fav.name}</h4>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {fav.start} → {fav.end} (step: {fav.step})
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLoadFavorite(fav)
                    }}
                    className="p-1.5 text-slate-400 hover:text-range-primary transition-colors rounded-lg hover:bg-range-primary/10"
                    title="Load this favorite"
                  >
                    <Download size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFavorite(fav.id)
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Remove favorite"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {favorites.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Star size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-bold uppercase tracking-widest">No favorites yet</p>
            <p className="text-[10px] mt-1">Save your frequently used ranges</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-3 rounded-xl">
          <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
            Quick Access
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Click any favorite to instantly load its configuration
          </p>
        </div>
      )}
    </div>
  )
}
