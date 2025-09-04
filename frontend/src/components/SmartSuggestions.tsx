import { useState } from 'react'
import { openaiService } from '../services/openaiService'
import { useStore } from '../store'

interface SmartSuggestionsProps {
  onTaskSelect: (task: string) => void
}

export function SmartSuggestions({ onTaskSelect }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { tasks } = useStore()
  
  const generateSuggestions = async () => {
    setIsLoading(true)
    
    try {
      const completedTasks = tasks
        .filter(task => task.status === 'done')
        .map(task => task.title)
      
      const currentHour = new Date().getHours()
      const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'
      
      const newSuggestions = await openaiService.generateTaskSuggestions({
        completedTasks,
        timeOfDay
      })
      
      setSuggestions(newSuggestions)
      setIsExpanded(true)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskSelect = (task: string) => {
    onTaskSelect(task)
    setIsExpanded(false)
    setSuggestions([])
  }

  if (!openaiService.isAvailable()) {
    return (
      <div className="smart-suggestions-unavailable">
        <div className="alert alert-info">
          <span>🤖 Smart suggestions unavailable - OpenAI API key not configured</span>
        </div>
      </div>
    )
  }

  return (
    <div className="smart-suggestions">
      <div className="suggestion-header">
        <button 
          className={`btn btn-outline w-full h-full ${isLoading ? 'loading' : ''}`}
          onClick={generateSuggestions}
          disabled={isLoading}
        >
          {isLoading ? '🤔 Thinking...' : '🤖 Get Smart Suggestions'}
        </button>
      </div>
      
      {isExpanded && suggestions.length > 0 && (
        <div className="suggestions-list">
          <div className="suggestions-header">
            <span className="text-sm font-medium">✨ Suggested tasks for you:</span>
            <button 
              className="btn btn-ghost btn-xs"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item btn btn-outline btn-sm"
                onClick={() => handleTaskSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          <div className="suggestions-footer">
            <button 
              className="btn btn-ghost btn-xs"
              onClick={generateSuggestions}
              disabled={isLoading}
            >
              🔄 Get new suggestions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
