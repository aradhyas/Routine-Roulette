import React from 'react'
import { Task } from '../store'

// Cute UI Components
interface TaskCardProps {
  task: Task
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function TaskCard({ task, isSelected, onToggleSelect, onDelete, showActions = true }: TaskCardProps) {
  const energyColors = {
    low: 'badge-energy-low',
    medium: 'badge-energy-medium',
    high: 'badge-energy-high'
  }

  return (
    <div 
      className={`card ${isSelected ? 'ring-2 ring-primary' : ''} cursor-pointer transition-all hover:shadow-lg`}
      onClick={() => onToggleSelect?.(task.id)}
    >
      <div className="flex justify-between items-start gap-md">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-sm">{task.title}</h4>
          <div className="flex gap-sm flex-wrap">
            <span className="badge badge-time">
              ⏱️ {task.est_minutes}m
            </span>
            <span className={`badge ${energyColors[task.energy]}`}>
              {task.energy === 'low' && '🟢'}
              {task.energy === 'medium' && '🟡'}
              {task.energy === 'high' && '🔴'}
              {task.energy}
            </span>
            {task.status !== 'open' && (
              <span className={`badge ${task.status === 'done' ? 'badge-energy-low' : 'opacity-50'}`}>
                {task.status === 'done' ? '✅ Done' : '❌ Abandoned'}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-sm">
            {isSelected && (
              <div className="text-primary text-xl">✓</div>
            )}
            {onDelete && (
              <button
                className="btn-ghost btn-sm opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-outline-variant rounded-full h-2 ${className}`}>
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

interface FloatingActionButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export function FloatingActionButton({ onClick, children, className = '' }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 btn btn-primary btn-lg rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      {children}
    </button>
  )
}

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-xl">
      <div className="text-6xl mb-lg opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold mb-sm text-on-surface-variant">{title}</h3>
      <p className="text-on-surface-variant mb-lg max-w-sm mx-auto">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-outline border-t-primary ${sizeClasses[size]} ${className}`} />
  )
}

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-primary text-white'
  }

  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 ${typeStyles[type]} px-lg py-md rounded-lg shadow-lg flex items-center gap-sm z-50`}>
      <span>{typeIcons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-sm opacity-75 hover:opacity-100">
        ×
      </button>
    </div>
  )
}

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel',
  onConfirm, 
  onCancel 
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-md">
      <div className="bg-surface rounded-lg p-lg max-w-sm w-full">
        <h3 className="font-semibold text-lg mb-sm">{title}</h3>
        <p className="text-on-surface-variant mb-lg">{message}</p>
        <div className="flex gap-sm justify-end">
          <button onClick={onCancel} className="btn btn-ghost">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
