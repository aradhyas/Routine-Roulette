import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { EmptyState, LoadingSpinner } from '../components/KUI'
import { Brain } from '../components/Brain'
import { normalizeText } from '../lib/normalize'

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
    const suggestions = [
      'Review emails and respond to urgent ones',
      'Plan tomorrow\'s schedule',
      'Take a 15-minute walk outside',
      'Organize workspace and clean desk',
      'Read for 30 minutes'
    ]
    
    // Get 3-5 random suggestions
    const randomSuggestions = suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 3))
    
    if (!rawText.trim()) {
      setRawText(randomSuggestions.join('\n'))
    } else {
      setRawText(prev => prev ? `${prev}\n${randomSuggestions.join('\n')}` : randomSuggestions.join('\n'))
    }
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
            
            {/* Task List */}
            <div className="space-y-3 px-4 sm:px-0 max-w-2xl mx-auto">
              {openTasks.map((task, index) => {
                const difficultyEmoji = task.energy === 'low' ? '🟢' : 
                                      task.energy === 'medium' ? '🟡' : '🔴'
                
                return (
                  <div 
                    key={task.id}
                    className="bg-surface rounded-lg p-4 border border-outline-variant hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/timer', { state: { task } })}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-sm font-mono text-gray-500 mt-0.5 flex-shrink-0">{index + 1}.</span>
                        <span className="font-medium text-gray-800 leading-relaxed">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className="text-lg">{difficultyEmoji}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors text-xl w-6 h-6 flex items-center justify-center"
                          title="Delete task"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div aria-hidden role="presentation" style={{ height: 40 }} />
            
            {/* Action Buttons - Centered */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setTasks([])}
                className="btn btn-secondary btn-sm"
                disabled={tasks.length === 0}
              >
                🗑️ Clear All
              </button>
              <button
                onClick={() => navigate('/spin')}
                className="btn btn-primary btn-sm"
                disabled={tasks.length === 0}
              >
                🎲 Spin Tasks
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
