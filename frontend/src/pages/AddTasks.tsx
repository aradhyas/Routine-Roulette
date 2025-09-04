import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { normalizeText } from '../lib/normalize'
import { EmptyState, LoadingSpinner } from '../components/KUI'
import { Brain } from '../components/Brain'


export function AddTasks() {
  const navigate = useNavigate()
  const { tasks, addTasks, setTasks, deleteTask } = useStore()
  const [rawText, setRawText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNormalize = async () => {
    if (!rawText.trim()) return

    setIsProcessing(true)

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = normalizeText(rawText)
      
      if (result.tasks.length > 0) {
        addTasks(result.tasks.map(task => ({ ...task, status: 'open' as const })))
        setRawText('')
      }
    } catch (error) {
      console.error('Error normalizing tasks:', error)
    } finally {
      setIsProcessing(false)
    }
  }



  const handleGetSmartSuggestions = async () => {
    if (!rawText.trim()) {
      // If no text, generate general suggestions
      const suggestions = await generateSmartSuggestions()
      if (suggestions.length > 0) {
        setRawText(suggestions.join('\n'))
      }
    } else {
      // If there's text, append suggestions to existing text
      const suggestions = await generateSmartSuggestions()
      if (suggestions.length > 0) {
        setRawText(prev => prev ? `${prev}\n${suggestions.join('\n')}` : suggestions.join('\n'))
      }
    }
  }

  const generateSmartSuggestions = async () => {
    try {
      const { openaiService } = await import('../services/openaiService')
      
      const completedTasks = tasks
        .filter(task => task.status === 'done')
        .map(task => task.title)
      
      const currentHour = new Date().getHours()
      const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'
      
      const suggestions = await openaiService.generateTaskSuggestions({
        completedTasks,
        timeOfDay
      })
      
      return suggestions
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
      // Fallback suggestions
      return [
        'Take a 10 minute walk',
        'Drink a glass of water',
        'Do 5 minutes of stretching',
        'Check and respond to important emails'
      ]
    }
  }


  const handleSpinTasks = () => {
    // Randomly select a task and go directly to timer
    if (openTasks.length === 0) return
    
    const randomTask = openTasks[Math.floor(Math.random() * openTasks.length)]
    navigate('/timer', { state: { task: randomTask } })
  }

  // Remove duplicate tasks by title and get only open tasks
  const openTasks = tasks
    .filter(task => task.status === 'open')
    .filter((task, index, arr) => 
      arr.findIndex(t => t.title === task.title) === index
    )

  return (
    <div className="container py-lg">
      {/* Header */}
      <div className="text-center mb-xl">
        <Brain mood="happy" size="lg" className="mb-md" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          ✨ You started - that's the hardest part. ✨
        </h1>
      </div>

      {/* Add Tasks Section */}
      <div className="card mb-xl">
        <div className="text-center py-lg">
          <h2 className="text-2xl font-bold">SPIN & SMASH YOUR TODOs</h2>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Check emails&#10;Water plants&#10;Review a project&#10;Take a walk"
          className="input textarea mb-md"
          rows={6}
          disabled={isProcessing}
        />

        <div className="flex gap-lg justify-center mt-2xl max-w-2xl mx-auto">
          <button
            onClick={handleNormalize}
            disabled={!rawText.trim() || isProcessing}
            className="btn btn-primary h-12 flex-1"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              'Add Tasks'
            )}
          </button>
          
          <button
            onClick={handleGetSmartSuggestions}
            disabled={isProcessing}
            className="btn btn-secondary h-12 flex-1"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              '🤖 Get Smart Suggestions'
            )}
          </button>
        </div>

      </div>

      {/* Task List Box */}
      {openTasks.length > 0 ? (
        <div className="card mb-xl">
          <div className="text-center py-lg">
            <h2 className="text-2xl font-bold mb-lg">📋 Your Tasks</h2>
            
            {/* Clean Task List */}
            <div className="max-w-2xl mx-auto space-y-sm">
              {openTasks.map((task, index) => {
                const difficultyEmoji = task.energy === 'low' ? '🟢' : 
                                       task.energy === 'medium' ? '🟡' : '🔴'
                
                return (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-md bg-white border border-gray-200 rounded-lg hover:shadow-sm group transition-all cursor-pointer"
                    onClick={() => navigate('/timer', { state: { task } })}
                  >
                    <div className="flex items-center gap-md flex-1">
                      <span className="text-sm font-mono text-gray-400 w-8">#{index + 1}</span>
                      <span className="font-medium text-gray-800 flex-1">{task.title}</span>
                      <span className="text-lg">{difficultyEmoji}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all ml-sm"
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
            <div aria-hidden role="presentation" style={{ height: 40 }} />
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-sm mt-[40px] mb-[24px] max-w-sm mx-auto">
              <button
                onClick={() => {
                  // Clear all tasks
                  setTasks([])
                }}
                className="btn btn-sm text-red-600 border border-red-300 hover:bg-red-50 px-md py-sm rounded-lg flex-1"
              >
                🗑️ Clear All
              </button>
              <button
                onClick={handleSpinTasks}
                className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white px-md py-sm rounded-lg flex-1"
              >
                🎡 Spin Tasks
              </button>
            </div>
            <div aria-hidden role="presentation" style={{ height: 20 }} />
            <p className="text-sm text-on-surface-variant">
              {openTasks.length} task{openTasks.length !== 1 ? 's' : ''} ready to spin!
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="📝"
          title="No tasks yet"
          description="Add tasks above to get started!"
        />
      )}

    </div>
  )
}
