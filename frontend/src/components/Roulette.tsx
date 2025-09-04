import { useState, useRef } from 'react'
import { Task } from '../store'

interface RouletteProps {
  tasks: Task[]
  onTaskSelected: (task: Task) => void
  isSpinning?: boolean
}

export function Roulette({ tasks, onTaskSelected, isSpinning = false }: RouletteProps) {
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spin = () => {
    if (isAnimating || tasks.length === 0) return

    setIsAnimating(true)
    
    // Calculate random rotation (multiple full spins + random angle)
    const spins = 5 + Math.random() * 5 // 5-10 full rotations
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + (spins * 360) + finalAngle
    
    setRotation(totalRotation)

    // Calculate which task was selected
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360
      const segmentAngle = 360 / tasks.length
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle)
      const selectedTask = tasks[selectedIndex] || tasks[0]
      
      setIsAnimating(false)
      onTaskSelected(selectedTask)
    }, 3000) // Match CSS animation duration
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-surface-variant rounded-lg">
        <p className="text-on-surface-variant">No tasks to spin!</p>
      </div>
    )
  }

  // Generate colors for each segment
  const colors = [
    '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5A2B', '#6B7280', '#7C3AED', '#DB2777'
  ]

  const segmentAngle = 360 / tasks.length
  
  return (
    <div className="flex flex-col items-center gap-lg">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
        </div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`w-64 h-64 rounded-full border-4 border-outline relative overflow-hidden ${
            isAnimating ? 'animate-spin-custom' : ''
          }`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isAnimating ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
          }}
        >
          {tasks.map((task, index) => {
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const midAngle = (startAngle + endAngle) / 2
            
            // Calculate path for segment
            const startX = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180)
            const startY = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180)
            const endX = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180)
            const endY = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180)
            
            const largeArcFlag = segmentAngle > 180 ? 1 : 0
            
            const pathData = [
              `M 50 50`,
              `L ${startX} ${startY}`,
              `A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ')

            // Text position
            const textRadius = 30
            const textX = 50 + textRadius * Math.cos((midAngle - 90) * Math.PI / 180)
            const textY = 50 + textRadius * Math.sin((midAngle - 90) * Math.PI / 180)
            
            return (
              <svg
                key={task.id}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <path
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="3"
                  fontWeight="600"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                >
                  {task.title.length > 15 ? task.title.substring(0, 12) + '...' : task.title}
                </text>
              </svg>
            )
          })}
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isAnimating || isSpinning}
        className={`btn btn-lg btn-primary ${isAnimating || isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isAnimating || isSpinning ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            Spinning...
          </>
        ) : (
          <>
            🎡 Spin the Wheel!
          </>
        )}
      </button>

      {/* Task Count */}
      <p className="text-sm text-on-surface-variant">
        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

interface RouletteResultProps {
  task: Task
  onAccept: () => void
  onSpin: () => void
}

export function RouletteResult({ task, onAccept, onSpin }: RouletteResultProps) {
  const [customMinutes, setCustomMinutes] = useState(task.est_minutes)

  const handleAcceptWithCustomTime = () => {
    onAccept()
  }

  return (
    <div className="card text-center">
      <div className="text-4xl mb-md">🎯</div>
      <h3 className="text-xl font-semibold mb-sm">Your task is...</h3>
      <div className="card bg-primary text-on-primary mb-lg">
        <h4 className="text-lg font-semibold">{task.title}</h4>
      </div>
      
      {/* Timer Controls */}
      <div className="mb-lg">
        <p className="text-sm text-on-surface-variant mb-md">⏰ Adjust your timer:</p>
        <div className="flex items-center justify-center gap-md mb-md">
          <button 
            onClick={() => setCustomMinutes(Math.max(1, customMinutes - 5))}
            className="btn btn-outline btn-sm"
          >
            -5m
          </button>
          <button 
            onClick={() => setCustomMinutes(Math.max(1, customMinutes - 1))}
            className="btn btn-outline btn-sm"
          >
            -1m
          </button>
          <div className="px-lg py-sm bg-surface-variant rounded-lg">
            <span className="text-2xl font-bold">{customMinutes}m</span>
          </div>
          <button 
            onClick={() => setCustomMinutes(customMinutes + 1)}
            className="btn btn-outline btn-sm"
          >
            +1m
          </button>
          <button 
            onClick={() => setCustomMinutes(customMinutes + 5)}
            className="btn btn-outline btn-sm"
          >
            +5m
          </button>
        </div>
      </div>
      
      <div className="flex gap-md justify-center">
        <button onClick={onSpin} className="btn btn-outline">
          🎡 Spin Again
        </button>
        <button onClick={handleAcceptWithCustomTime} className="btn btn-primary">
          ▶️ Start Timer ({customMinutes}m)
        </button>
      </div>
    </div>
  )
}
