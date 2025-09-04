import OpenAI from 'openai'

class OpenAIService {
  private client: OpenAI | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      console.warn('OpenAI API key not found. Smart suggestions will be disabled.')
      return
    }

    try {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      })
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error)
    }
  }

  isAvailable(): boolean {
    return this.isInitialized && this.client !== null
  }

  async generateTaskSuggestions(context: {
    completedTasks?: string[]
    timeOfDay?: string
    mood?: string
    category?: string
  }): Promise<string[]> {
    if (!this.client) {
      return this.getFallbackSuggestions(context)
    }

    try {
      const prompt = this.buildPrompt(context)
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that suggests productive tasks for a routine roulette app. Provide 5 short, actionable task suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })

      const content = response.choices[0]?.message?.content
      if (!content) return this.getFallbackSuggestions(context)

      return this.parseTaskSuggestions(content)
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.getFallbackSuggestions(context)
    }
  }

  private buildPrompt(context: {
    completedTasks?: string[]
    timeOfDay?: string
    mood?: string
    category?: string
  }): string {
    let prompt = 'Suggest 5 productive tasks for someone to do right now.'
    
    if (context.timeOfDay) {
      prompt += ` It's currently ${context.timeOfDay}.`
    }
    
    if (context.mood) {
      prompt += ` They're feeling ${context.mood}.`
    }
    
    if (context.category) {
      prompt += ` Focus on ${context.category} tasks.`
    }
    
    if (context.completedTasks && context.completedTasks.length > 0) {
      prompt += ` They recently completed: ${context.completedTasks.slice(-3).join(', ')}.`
    }
    
    prompt += ' Each task should be 2-8 words and take 5-30 minutes. Format as a numbered list.'
    
    return prompt
  }

  private parseTaskSuggestions(content: string): string[] {
    const lines = content.split('\n')
    const tasks: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && (trimmed.match(/^\d+\./) || trimmed.match(/^-/))) {
        const task = trimmed.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim()
        if (task && task.length > 0) {
          tasks.push(task)
        }
      }
    }
    
    return tasks.slice(0, 5) // Ensure max 5 suggestions
  }

  async extractTimeFromTask(taskDescription: string): Promise<number | null> {
    if (!this.client) {
      return this.extractTimeWithRegex(taskDescription)
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a time extraction assistant. Extract the duration in minutes from task descriptions. If no explicit time is mentioned, return null. Only return a number (minutes) or null.'
          },
          {
            role: 'user',
            content: `Extract the duration in minutes from this task: "${taskDescription}"`
          }
        ],
        max_tokens: 10,
        temperature: 0
      })

      const content = response.choices[0]?.message?.content?.trim()
      if (!content || content === 'null') return null
      
      const minutes = parseInt(content)
      return isNaN(minutes) ? null : Math.max(1, Math.min(120, minutes))
    } catch (error) {
      console.error('OpenAI time extraction error:', error)
      return this.extractTimeWithRegex(taskDescription)
    }
  }

  private extractTimeWithRegex(taskDescription: string): number | null {
    const timePatterns = [
      /(\d+)\s*(?:mins?|minutes?)/i,
      /(\d+)\s*(?:hrs?|hours?)/i,
      /(\d+)\s*(?:secs?|seconds?)/i,
      /for\s+(\d+)\s*(?:mins?|minutes?)/i,
      /(\d+)\s*(?:min|minute)\s+/i,
      /(\d+)\s*(?:hr|hour)\s+/i
    ]
    
    for (const pattern of timePatterns) {
      const match = taskDescription.match(pattern)
      if (match) {
        const value = parseInt(match[1])
        if (pattern.source.includes('hrs?|hours?') || pattern.source.includes('hr|hour')) {
          return value * 60 // Convert hours to minutes
        } else if (pattern.source.includes('secs?|seconds?')) {
          return Math.max(1, Math.round(value / 60)) // Convert seconds to minutes, min 1
        } else {
          return value // Already in minutes
        }
      }
    }
    return null
  }

  private getFallbackSuggestions(context: {
    timeOfDay?: string
    mood?: string
    category?: string
  }): string[] {
    const morningTasks = [
      'Review daily goals',
      'Organize workspace',
      'Check and respond to emails',
      'Plan the day ahead',
      'Do 10 minutes of stretching'
    ]
    
    const afternoonTasks = [
      'Take a 15-minute walk',
      'Organize digital files',
      'Call a friend or family member',
      'Review and update task list',
      'Do a quick room cleanup'
    ]
    
    const eveningTasks = [
      'Reflect on the day',
      'Prepare for tomorrow',
      'Read for 20 minutes',
      'Practice gratitude journaling',
      'Do evening skincare routine'
    ]
    
    if (context.timeOfDay === 'morning') return morningTasks
    if (context.timeOfDay === 'evening') return eveningTasks
    
    return afternoonTasks
  }
}

export const openaiService = new OpenAIService()
