// On-device task normalization heuristics
export interface NormalizedTask {
  title: string
  est_minutes: number
  energy: 'low' | 'medium' | 'high'
}

export interface QualityMetrics {
  actionable: boolean
  size_ok: boolean
  safe: boolean
}

export interface NormalizeResult {
  tasks: NormalizedTask[]
  quality: QualityMetrics
}


export function normalizeText(rawText: string): NormalizeResult {
  // Split into lines and clean up
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const tasks: NormalizedTask[] = []

  for (const line of lines) {
    // Skip very short lines
    if (line.length < 3) continue

    // Clean up the line - remove bullets, numbers, etc.
    const cleanLine = line
      .replace(/^[-*•\d+\.\)\]\}\s]+/, '') // Remove bullets and numbering
      .replace(/^\s*[-]\s*/, '') // Remove dashes
      .trim()

    if (!cleanLine || cleanLine.length < 3) continue

    // Simple default timer - 10 minutes for all tasks
    let estMinutes = 10

    // Determine energy level based on keywords and context
    let energy: 'low' | 'medium' | 'high' = 'medium'
    const lowerLine = cleanLine.toLowerCase()

    const lowEnergyWords = [
      'read', 'review', 'check', 'browse', 'look', 'watch', 'listen',
      'scan', 'skim', 'observe', 'monitor', 'track', 'update', 'edit',
      'organize', 'sort', 'file', 'archive', 'backup', 'sync'
    ]

    const highEnergyWords = [
      'create', 'build', 'write', 'design', 'implement', 'develop',
      'code', 'program', 'exercise', 'workout', 'run', 'gym',
      'meeting', 'present', 'pitch', 'negotiate', 'debate',
      'brainstorm', 'innovate', 'solve', 'fix', 'troubleshoot',
      'research', 'analyze', 'study', 'learn', 'practice'
    ]

    // Check for energy indicators
    if (lowEnergyWords.some(word => lowerLine.includes(word))) {
      energy = 'low'
    } else if (highEnergyWords.some(word => lowerLine.includes(word))) {
      energy = 'high'
    }

    // Context-based energy adjustments
    if (lowerLine.includes('quick') || lowerLine.includes('brief')) {
      energy = energy === 'high' ? 'medium' : 'low'
    }

    if (lowerLine.includes('deep') || lowerLine.includes('thorough')) {
      energy = energy === 'low' ? 'medium' : 'high'
    }

    tasks.push({
      title: cleanLine,
      est_minutes: estMinutes,
      energy
    })
  }

  // Quality assessment
  const quality: QualityMetrics = {
    actionable: tasks.length > 0 && tasks.every(task => 
      task.title.length > 5 && 
      !task.title.toLowerCase().includes('maybe') &&
      !task.title.toLowerCase().includes('consider') &&
      !task.title.toLowerCase().includes('think about')
    ),
    size_ok: tasks.length > 0 && tasks.length <= 10,
    safe: tasks.every(task => {
      const title = task.title.toLowerCase()
      const dangerousWords = ['delete', 'remove', 'destroy', 'kill', 'harm', 'break']
      return !dangerousWords.some(word => title.includes(word))
    })
  }

  return { tasks, quality }
}

// Sample task lists for demo
export const sampleTaskLists = [
  {
    name: "Morning Routine",
    tasks: `Check emails
Review today's calendar
Water plants
Make bed
10 minute meditation
Plan lunch`
  },
  {
    name: "Work Focus",
    tasks: `Review project requirements
Update task board
Write documentation
Code review for PR #123
Team standup meeting
Respond to Slack messages`
  },
  {
    name: "Personal Care",
    tasks: `Take vitamins
Drink water
Stretch for 5 minutes
Skincare routine
Brush teeth
Quick tidy up room`
  },
  {
    name: "Learning & Growth",
    tasks: `Read 10 pages of current book
Practice Spanish for 15 minutes
Watch tutorial video
Take notes on new concept
Review flashcards
Research weekend workshop`
  }
]
