import React from 'react'

interface BrainProps {
  mood: 'happy' | 'focused' | 'dancing' | 'frustrated'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Brain({ mood, size = 'md', className = '' }: BrainProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  }

  const animations = {
    happy: 'animate-bounce',
    focused: 'animate-pulse',
    dancing: 'animate-bounce',
    frustrated: ''
  }

  // Brain mascot SVG for all moods
  const brainMascot = (
    <img 
      src="/brain-mascot.svg"
      alt="Brain mascot" 
      className={`${sizeClasses[size]} ${animations[mood]} ${className} object-contain`}
      style={{ 
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
      }}
    />
  )

  return brainMascot
}

interface BrainWithMessageProps extends BrainProps {
  message?: string
  showMessage?: boolean
}

export function BrainWithMessage({ message, showMessage = true, ...brainProps }: BrainWithMessageProps) {
  const moodMessages = {
    happy: "Let's go! 🎉",
    focused: "Focus time! 💪",
    dancing: "You're on fire! 🔥",
    frustrated: "We got this! 💙"
  }

  const displayMessage = message || moodMessages[brainProps.mood]

  return (
    <div className="flex flex-col items-center gap-md">
      <Brain {...brainProps} />
      {showMessage && (
        <div className="bg-surface-variant rounded-lg px-md py-sm max-w-xs text-center">
          <p className="text-sm text-on-surface-variant">{displayMessage}</p>
        </div>
      )}
    </div>
  )
}

// Hook to manage brain mood based on app state
export function useBrainMood() {
  const [mood, setMood] = React.useState<'happy' | 'focused' | 'dancing' | 'frustrated'>('happy')

  const updateMood = React.useCallback((newMood: 'happy' | 'focused' | 'dancing' | 'frustrated') => {
    setMood(newMood)
  }, [])

  const celebrateMood = React.useCallback(() => {
    setMood('dancing')
    // Reset to happy after celebration
    setTimeout(() => setMood('happy'), 3000)
  }, [])

  const focusMood = React.useCallback(() => {
    setMood('focused')
  }, [])

  const frustratedMood = React.useCallback(() => {
    setMood('frustrated')
    // Reset to happy after a moment
    setTimeout(() => setMood('happy'), 2000)
  }, [])

  return {
    mood,
    updateMood,
    celebrateMood,
    focusMood,
    frustratedMood
  }
}
