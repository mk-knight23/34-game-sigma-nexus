import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Flame, Trophy, Target, Zap, Calendar, Play, ChevronRight, Award } from 'lucide-react'
import {
  generateRoundForLevel,
  dailyChallenge,
  dateKey,
  scoreRound,
  getDifficulty,
  levelForCorrectCount,
  type ChallengeRound,
} from '@/utils/gameLogic'
import { useStatsStore } from '@/stores/stats'

type Mode = 'idle' | 'playing' | 'over'
type GameKind = 'endless' | 'daily'

const ROUNDS_PER_GAME = 10
const TICK_MS = 100

interface FeedbackState {
  correct: boolean
  answer: number
  points: number
}

export function ChallengeMode() {
  const recordGame = useStatsStore((s) => s.recordGame)
  const recordDailyResult = useStatsStore((s) => s.recordDailyResult)
  const dailyBest = useStatsStore((s) => s.dailyBest)
  const sessionHigh = useStatsStore((s) => s.highScore)

  const [mode, setMode] = useState<Mode>('idle')
  const [kind, setKind] = useState<GameKind>('endless')
  const [round, setRound] = useState<ChallengeRound | null>(null)
  const [roundNumber, setRoundNumber] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const deadlineRef = useRef<number>(0)

  const today = new Date()
  const todayKey = dateKey(today)
  const dailyDone = todayKey in dailyBest
  const level = kind === 'daily' ? 3 : levelForCorrectCount(correctCount)
  const difficulty = getDifficulty(level)

  // Build the next round (or finish the game for daily / round cap).
  const nextRound = useCallback(
    (currentCorrect: number, currentRoundNumber: number) => {
      if (kind === 'daily') {
        setRound(dailyChallenge(today))
      } else {
        setRound(generateRoundForLevel(levelForCorrectCount(currentCorrect)))
      }
      setRoundNumber(currentRoundNumber + 1)
      setGuess('')
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [kind]
  )

  // Timer loop.
  useEffect(() => {
    if (mode !== 'playing' || !round || feedback) return
    deadlineRef.current = Date.now() + round.timeLimit * 1000
    setTimeLeft(round.timeLimit)

    const id = setInterval(() => {
      const remaining = Math.max(0, (deadlineRef.current - Date.now()) / 1000)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(id)
        handleSubmit(true)
      }
    }, TICK_MS)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, round, feedback])

  // Focus the input when a new round begins.
  useEffect(() => {
    if (mode === 'playing' && !feedback) inputRef.current?.focus()
  }, [mode, round, feedback])

  const startGame = (gameKind: GameKind) => {
    setKind(gameKind)
    setMode('playing')
    setRoundNumber(0)
    setCorrectCount(0)
    setStreak(0)
    setBestStreak(0)
    setScore(0)
    setFeedback(null)
    if (gameKind === 'daily') {
      setRound(dailyChallenge(new Date()))
    } else {
      setRound(generateRoundForLevel(1))
    }
    setRoundNumber(1)
    setGuess('')
  }

  const finishGame = useCallback(
    (finalScore: number, finalCorrect: number, finalBestStreak: number) => {
      setMode('over')
      if (kind === 'daily') {
        recordDailyResult(new Date(), finalScore)
      }
      recordGame(finalScore, {
        correct: finalCorrect,
        bestStreak: finalBestStreak,
        maxLevel: levelForCorrectCount(finalCorrect),
      })
    },
    [kind, recordDailyResult, recordGame]
  )

  const handleSubmit = useCallback(
    (timedOut = false) => {
      if (!round || feedback) return
      const value = parseFloat(guess)
      const correct = !timedOut && !isNaN(value) && value === round.answer
      const remaining = Math.max(0, (deadlineRef.current - Date.now()) / 1000)

      const result = scoreRound({
        correct,
        timeRemaining: remaining,
        timeLimit: round.timeLimit,
        streak,
        level,
      })

      const newScore = score + result.points
      const newStreak = correct ? streak + 1 : 0
      const newCorrect = correctCount + (correct ? 1 : 0)
      const newBestStreak = Math.max(bestStreak, newStreak)

      setScore(newScore)
      setStreak(newStreak)
      setCorrectCount(newCorrect)
      setBestStreak(newBestStreak)
      setFeedback({ correct, answer: round.answer, points: result.points })

      // Daily challenge is a single round; endless runs a fixed number.
      const isLastRound = kind === 'daily' || roundNumber >= ROUNDS_PER_GAME

      setTimeout(() => {
        setFeedback(null)
        if (isLastRound) {
          finishGame(newScore, newCorrect, newBestStreak)
        } else {
          nextRound(newCorrect, roundNumber)
        }
      }, 1400)
    },
    [round, feedback, guess, streak, level, score, correctCount, bestStreak, roundNumber, kind, nextRound, finishGame]
  )

  const timePct = round ? Math.max(0, Math.min(100, (timeLeft / round.timeLimit) * 100)) : 0

  // ---- Idle / start screen ----
  if (mode === 'idle' || mode === 'over') {
    const isOver = mode === 'over'
    return (
      <div className="glass p-8 rounded-[2.5rem] shadow-xl space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-range-primary/10 text-range-primary">
            <Target size={28} />
          </div>
          <h3 className="font-display text-2xl font-black uppercase tracking-widest text-stone-100">
            {isOver ? 'Game Over' : 'Guess the Sum'}
          </h3>
          {isOver ? (
            <div className="space-y-1">
              <p className="font-display text-6xl font-black text-range-primary text-glow">{score.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {correctCount} correct · best streak {bestStreak}
              </p>
              {score >= sessionHigh && score > 0 && (
                <p className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center justify-center gap-1">
                  <Award size={12} /> New personal best!
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              A range appears. Add it up before the timer runs out. Faster and
              longer streaks score more. Difficulty climbs as you go.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => startGame('endless')}
            className="bg-range-primary hover:bg-range-primary/90 text-black font-black p-5 rounded-2xl shadow-lg shadow-range-primary/30 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Play size={18} /> {isOver ? 'Play Again' : 'Start Challenge'}
          </button>
          <button
            onClick={() => startGame('daily')}
            disabled={dailyDone}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-black p-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Calendar size={18} />
            {dailyDone ? `Daily done (${dailyBest[todayKey]})` : 'Daily Challenge'}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 font-mono">
          Daily challenge is the same range for everyone, every day.
        </p>
      </div>
    )
  }

  // ---- Playing screen ----
  return (
    <div className="glass p-8 rounded-[2.5rem] shadow-xl space-y-6 max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-range-primary">
          <Zap size={14} /> {score.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5 text-orange-500">
          <Flame size={14} /> {streak}
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <Trophy size={14} /> Lvl {level} · {difficulty.name}
        </span>
        {kind === 'endless' && (
          <span className="text-slate-400">
            {roundNumber}/{ROUNDS_PER_GAME}
          </span>
        )}
      </div>

      {/* Timer bar */}
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${timePct < 25 ? 'bg-red-500' : 'bg-range-primary'}`}
          animate={{ width: `${timePct}%` }}
          transition={{ ease: 'linear', duration: TICK_MS / 1000 }}
        />
      </div>

      {/* Prompt */}
      <div className="text-center space-y-3 py-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-center gap-1">
          <Timer size={12} /> {timeLeft.toFixed(1)}s · Sum this range
        </p>
        {round && (
          <p className="font-mono text-3xl md:text-4xl font-black text-stone-50">
            {round.start} <span className="text-sigma-primary/60">→</span> {round.end}
            {round.step !== 1 && (
              <span className="text-lg text-range-secondary"> step {round.step}</span>
            )}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center p-4 rounded-2xl ${
              feedback.correct
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                : 'bg-red-50 dark:bg-red-900/20 text-red-500'
            }`}
          >
            <p className="font-black text-lg">
              {feedback.correct ? `Correct! +${feedback.points}` : 'Missed'}
            </p>
            {!feedback.correct && (
              <p className="text-sm font-mono">Answer was {feedback.answer.toLocaleString()}</p>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(false)
            }}
            className="flex gap-3"
          >
            <input
              ref={inputRef}
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your answer…"
              className="flex-1 bg-black/40 border border-sigma-primary/25 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-range-primary text-stone-100 transition-all font-mono text-lg text-center"
            />
            <button
              type="submit"
              className="bg-range-primary hover:bg-range-primary/90 text-black font-black px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_18px_#fbbf2444]"
            >
              <ChevronRight size={20} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
