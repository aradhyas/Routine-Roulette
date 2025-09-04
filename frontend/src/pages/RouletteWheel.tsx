import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Brain } from '../components/Brain'

export function RouletteWheel() {
  const navigate = useNavigate()
  const { tasks } = useStore()

  const openTasks = tasks
    .filter(task => task.status === 'open')
    .filter((task, index, arr) => 
      arr.findIndex(t => t.title === task.title) === index
    )

  useEffect(() => {
    if (openTasks.length === 0) {
      navigate('/add-tasks')
    }
  }, [openTasks.length, navigate])

  const handleTaskSelect = (task: any) => {
    navigate('/timer', { state: { task } })
  }

  if (openTasks.length === 0) {
    return null
  }

  return (
    <div className="container py-lg">
      {/* Header */}
      <div className="text-center mb-xl">
        <Brain mood="happy" size="lg" className="mb-md" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          🎡 Task Roulette Wheel
        </h1>
        <p className="text-lg text-on-surface-variant mt-md">
          Spin the wheel and let fate choose your next task!
        </p>
      </div>

      {/* Clean Task Selection */}
      <div className="max-w-2xl mx-auto">
        <div className="card p-xl">
          <h3 className="text-2xl font-bold text-center mb-xl">🎯 Choose Your Task</h3>
          
          {/* Well-aligned task grid */}
          <div className="space-y-lg mb-xl">
            {openTasks.map((task) => {
              const energyConfig = {
                low: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', icon: '🌱' },
                medium: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', icon: '⚡' },
                high: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', icon: '🔥' }
              }
              const config = energyConfig[task.energy as keyof typeof energyConfig] || energyConfig.low
              
              return (
                <div
                  key={task.id}
                  className={`
                    ${config.bg} ${config.border} border-2 rounded-xl p-lg cursor-pointer
                    transform transition-all duration-200 hover:scale-102 hover:shadow-lg
                  `}
                  onClick={() => handleTaskSelect(task)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md">
                      <div className="text-2xl">{config.icon}</div>
                      <div>
                        <h4 className="font-bold text-lg">{task.title}</h4>
                        <p className="text-sm text-gray-600">Estimated: {task.est_minutes} minutes</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.text} bg-white`}>
                      {task.energy?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Action buttons */}
          <div className="text-center space-y-md">
            <button
              onClick={() => {
                const randomTask = openTasks[Math.floor(Math.random() * openTasks.length)]
                handleTaskSelect(randomTask)
              }}
              className="btn btn-xl btn-primary w-full"
            >
              🎲 PICK RANDOM TASK
            </button>
            
            <p className="text-sm text-gray-500">
              Click any task above or let fate decide with the random picker!
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-xl">
        <button
          onClick={() => navigate('/add-tasks')}
          className="btn btn-outline"
        >
          ← Back to Tasks
        </button>
      </div>

      {/* Energy Legend */}
      <div className="flex justify-center gap-lg text-sm mt-lg">
        <div className="flex items-center gap-xs">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Low Energy</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span>Medium Energy</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>High Energy</span>
        </div>
      </div>
    </div>
  )
}
