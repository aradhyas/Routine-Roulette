import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Roulette, RouletteResult } from '../components/Roulette'
import { BrainWithMessage, useBrainMood } from '../components/Brain'
import { EmptyState } from '../components/KUI'
import confetti from 'canvas-confetti'

export function Spin() {
  const navigate = useNavigate()
  const { tasks, selectedTaskIds, startTimer } = useStore()
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isSpinning] = useState(false)
  const { mood, updateMood, celebrateMood, focusMood } = useBrainMood()

  const selectedTasks = tasks.filter(task => 
    selectedTaskIds.includes(task.id) && task.status === 'open'
  )

  useEffect(() => {
    if (selectedTasks.length === 0) {
      navigate('/add-tasks')
    }
  }, [selectedTasks.length, navigate])

  const handleTaskSelected = (task: any) => {
    setSelectedTask(task)
    celebrateMood()
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleAcceptTask = async () => {
    if (!selectedTask) return

    focusMood()
    
    // Start timer and navigate
    startTimer(selectedTask.id, selectedTask.est_minutes)
    navigate('/timer')
  }

  const handleSpinAgain = () => {
    setSelectedTask(null)
    updateMood('happy')
  }

  if (selectedTasks.length === 0) {
    return (
      <div className="container py-lg">
        <EmptyState
          icon="🎡"
          title="No tasks selected"
          description="Select tasks to spin!"
          action={{
            label: "Add Tasks",
            onClick: () => navigate('/add-tasks')
          }}
        />
      </div>
    )
  }

  return (
    <div className="container py-lg">
      {/* Header */}
      <div className="text-center mb-xl">
        <BrainWithMessage 
          mood={mood} 
          size="lg" 
          message={selectedTask ? "Ready to start? 🎯" : "Spin time! 🎲"}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/add-tasks')}
        className="btn btn-ghost mb-lg"
      >
        ← Back to Tasks
      </button>

      {selectedTask ? (
        <RouletteResult
          task={selectedTask}
          onAccept={handleAcceptTask}
          onSpin={handleSpinAgain}
        />
      ) : (
        <div className="text-center">
          <Roulette
            tasks={selectedTasks}
            onTaskSelected={handleTaskSelected}
            isSpinning={isSpinning}
          />
          
          <div className="mt-xl">
            <p className="text-lg text-on-surface-variant mb-lg">
              🎲 Spin the wheel to choose your next task!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
