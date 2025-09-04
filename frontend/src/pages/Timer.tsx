import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import { useBrainMood } from '../components/Brain'
import { ProgressBar, ConfirmDialog } from '../components/KUI'
import { KnittingCat } from '../components/KnittingCat'
import { voiceService } from '../services/voiceService'
import confetti from 'canvas-confetti'

// utils
const getTimeRemaining = (endTime: number) => {
  const now = Date.now()
  const totalSeconds = Math.max(0, Math.floor((endTime - now) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return { minutes, seconds, totalSeconds, isExpired: totalSeconds <= 0 }
}
const getProgressPercentage = (startTime: number, endTime: number) => {
  const now = Date.now()
  const total = Math.max(1, endTime - startTime)
  const elapsed = Math.min(total, Math.max(0, now - startTime))
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}
const formatTime = (m: number, s: number) =>
  `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`

export function Timer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { timer, tasks, pauseTimer, resumeTimer, resetTimer, completeTimer, updateTask, startTimer } = useStore()
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0, totalSeconds: 0, isExpired: false })
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showAbandonDialog, setShowAbandonDialog] = useState(false)
  const pausedSecondsRef = useRef<number | null>(null) // keep exact remaining secs when paused
  const { updateMood, celebrateMood, focusMood } = useBrainMood()

  // Prefer task passed from /spin, else current by id
  const taskFromState = (location.state as any)?.task
  const currentTask = taskFromState || tasks.find(t => t.id === timer.taskId)

  useEffect(() => {
    if (taskFromState && !timer.isRunning) {
      console.log('Auto-starting timer with task:', taskFromState.title, 'for', taskFromState.est_minutes, 'minutes')
      startTimer(taskFromState.id, taskFromState.est_minutes)
    }
    if (!currentTask) {
      navigate('/add-tasks')
      return
    }
    focusMood()
  }, [taskFromState, timer.isRunning, currentTask, navigate, focusMood, startTimer])

  useEffect(() => {
    if (!timer.endTime) return
    const tick = () => {
      const remaining = getTimeRemaining(timer.endTime!)
      setTimeRemaining(remaining)
      if (remaining.isExpired && timer.isRunning) {
        voiceService.announceTimeExpired()
        handleComplete(true)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timer.isRunning, timer.endTime])

  // --- start timer ---
  const handleStart = () => {
    if (!currentTask) return
    console.log('Manual start with task:', currentTask.title, 'for', currentTask.est_minutes, 'minutes')
    startTimer(currentTask.id, currentTask.est_minutes)
    focusMood()
    voiceService.announceTaskStart(currentTask.title)
  }

  const handleReset = () => {
    resetTimer()
    setShowResetDialog(false)
    pausedSecondsRef.current = null
    updateMood('happy')
  }

  const handleComplete = (success: boolean) => {
    completeTimer(success)
    if (success) {
      celebrateMood()
      confetti({ particleCount: 140, spread: 95, origin: { y: 0.6 } })
      voiceService.announceTaskComplete(currentTask?.title || 'your task')
    } else {
      updateMood('frustrated')
    }
    setTimeout(() => navigate('/add-tasks'), success ? 1800 : 800)
  }
  const handleAbandon = () => { 
    voiceService.announceTaskAbandon()
    handleComplete(false); 
    setShowAbandonDialog(false) 
  }
  const handleNextTask = () => navigate('/add-tasks')

  // --- adjust time by ±1 minute ---
  const adjustByMinutes = (deltaMinutes: number) => {
    if (!currentTask) return
    const deltaSec = deltaMinutes * 60

    // If running: recompute remaining, then resume/start with new remaining
    if (timer.isRunning && timer.endTime) {
      const remain = Math.max(0, Math.floor((timer.endTime - Date.now()) / 1000))
      const newRemain = Math.max(60, remain + deltaSec) // keep at least 1 minute
      // quick restart to apply new remaining
      pauseTimer()
      if (typeof (resumeTimer as any) === 'function' && (resumeTimer as any).length >= 1) {
        (resumeTimer as any)(newRemain)
      } else {
        startTimer(currentTask.id, Math.max(1, Math.ceil(newRemain / 60)))
      }
      return
    }

    // If paused: update cached remaining seconds + task estimate
    if (timer.isPaused) {
      const baseRemain = pausedSecondsRef.current ?? currentTask.est_minutes * 60
      const newRemain = Math.max(60, baseRemain + deltaSec)
      pausedSecondsRef.current = newRemain
      updateTask(currentTask.id, { est_minutes: Math.max(1, Math.ceil(newRemain / 60)) })
      return
    }

    // If idle (not started yet): just change the task estimate
    updateTask(currentTask.id, { est_minutes: Math.max(1, currentTask.est_minutes + deltaMinutes) })
  }

  if (!currentTask) return null

  const progress = timer.startTime && timer.endTime ? getProgressPercentage(timer.startTime, timer.endTime) : 0

  return (
    <div className="container py-lg">
      <div className="max-w-2xl mx-auto">
        {/* Illustration with extra space */}
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <KnittingCat width={340} height={230} theme="warm" speed={timer.isRunning ? 1 : 0.6} paused={timer.isPaused} />
        </div>

        {/* Title + meta */}
        <div className="text-center mb-md">
          <h2 className="title-xl mb-xs">TASK: {currentTask.title}</h2>
          <div className="meta-row">
            <span className="pill">⏱️ <strong>{currentTask.est_minutes}m</strong></span>
            <span className={`pill ${currentTask.energy === 'low' ? 'pill-low' : 'pill-med'}`}>
              {currentTask.energy === 'low' ? '🟢 Low energy' : '🟡 Medium energy'}
            </span>
          </div>
        </div>

        {/* Timer with ± beside */}
        <div className="text-center mb-md">
          <div className="timer-row">
            <button className="timer-nudge" onClick={() => adjustByMinutes(-1)} title="-1 minute">−</button>
            <div className="timer-digits">{formatTime(timeRemaining.minutes, timeRemaining.seconds)}</div>
            <button className="timer-nudge" onClick={() => adjustByMinutes(+1)} title="+1 minute">+</button>
          </div>
          <ProgressBar progress={progress} className="mb-sm" />
          <div className="caption">{timer.isRunning ? 'Remaining' : timer.isPaused ? 'Paused' : 'Ready'}</div>
        </div>

        {/* Start/Reset buttons */}
        <div className="row-2 equal mb-md" style={{ gap: 16 }}>
          {!timer.isRunning && (
            <button className="btn btn-primary btn-sm" onClick={handleStart}>
              ▶ Start
            </button>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => setShowResetDialog(true)}>
            🔄 Reset
          </button>
        </div>

        {/* Complete & Abandon (same line) */}
        <div className="row-2 equal mb-lg" style={{ gap: 16 }}>
          <button className="btn btn-success btn-sm" onClick={() => handleComplete(true)}>✅ Complete</button>
          <button className="btn btn-danger-ghost btn-sm" onClick={() => setShowAbandonDialog(true)}>❌ Abandon</button>
        </div>

        {/* Nav */}
        <div className="row-2 justify-center" style={{ gap: 16, marginTop: 20, marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/add-tasks')}>← Back to Tasks</button>
          <button className="btn btn-outline btn-sm" onClick={handleNextTask}>Next Task →</button>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showResetDialog}
        onConfirm={handleReset}
        onCancel={() => setShowResetDialog(false)}
      />
      <ConfirmDialog
        isOpen={showAbandonDialog}
        onConfirm={handleAbandon}
        onCancel={() => setShowAbandonDialog(false)}
      />
    </div>
  )
}
