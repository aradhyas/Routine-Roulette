// Time utilities for countdown and timer functionality

export interface TimeRemaining {
  minutes: number
  seconds: number
  totalSeconds: number
  isExpired: boolean
}

export function getTimeRemaining(endTimestamp: number): TimeRemaining {
  const now = Date.now()
  const totalSeconds = Math.max(0, Math.floor((endTimestamp - now) / 1000))
  
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return {
    minutes,
    seconds,
    totalSeconds,
    isExpired: totalSeconds <= 0
  }
}

export function formatTime(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`
  }
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (minutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${minutes}m`
}

export function getProgressPercentage(startTime: number, endTime: number): number {
  const now = Date.now()
  const total = endTime - startTime
  const elapsed = now - startTime
  
  if (total <= 0) return 0
  if (elapsed <= 0) return 0
  if (elapsed >= total) return 100
  
  return Math.floor((elapsed / total) * 100)
}

export function createEndTimestamp(minutes: number): number {
  return Date.now() + (minutes * 60 * 1000)
}

export function minutesToMilliseconds(minutes: number): number {
  return minutes * 60 * 1000
}

export function millisecondsToMinutes(milliseconds: number): number {
  return Math.floor(milliseconds / (60 * 1000))
}

// Note: React hooks are imported in components that use these utilities
