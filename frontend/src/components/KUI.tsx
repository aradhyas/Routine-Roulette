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
      className={`task-card ${isSelected ? 'task-card-selected' : ''}`}
      onClick={() => onToggleSelect?.(task.id)}
    >
      <div className="task-card-content">
        <div className="task-card-main">
          <div className="task-card-header">
            <span className="task-card-number">#{task.id.slice(-1)}</span>
            <h4 className="task-card-title">{task.title}</h4>
          </div>
          <div className="task-card-badges">
            <span className="task-badge task-badge-time">
              {task.est_minutes}m
            </span>
            <span className={`task-badge task-badge-energy ${energyColors[task.energy]}`}>
              {task.energy === 'low' && '🟢'}
              {task.energy === 'medium' && '🟡'}
              {task.energy === 'high' && '🔴'}
            </span>
            {task.status !== 'open' && (
              <span className={`task-badge ${task.status === 'done' ? 'task-badge-done' : 'task-badge-abandoned'}`}>
                {task.status === 'done' ? '✅' : '❌'}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="task-card-actions">
            {isSelected && (
              <div className="task-card-selected-icon">✓</div>
            )}
            {onDelete && (
              <button
                className="task-card-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
                title="Delete task"
              >
                ×
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
  type?: 'abandon' | 'reset'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ 
  isOpen, 
  type = 'abandon',
  onConfirm, 
  onCancel 
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const isAbandon = type === 'abandon'

  return (
    <div 
      className="cute-modal-overlay"
      onClick={onCancel}
    >
      <div 
        className="cute-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="cute-modal-cat">
          {isAbandon ? '😿' : '🔄'}
        </div>

        {/* Message */}
        <div className="cute-modal-content">
          <p className="cute-modal-text">
            {isAbandon ? (
              <>
                The knitting cat will be sad.<br />
                <strong>ARE YOU SURE YOU WANT TO ABANDON?</strong>
              </>
            ) : (
              <>
                Reset your progress?<br />
                <strong>YOUR TIMER WILL START OVER</strong>
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="cute-modal-actions">
          <button 
            onClick={onCancel} 
            className="cute-btn cute-btn-keep"
          >
            {isAbandon ? 'Keep Going! 🧶' : 'Keep Timer ⏰'}
          </button>
          <button 
            onClick={onConfirm} 
            className="cute-btn cute-btn-abandon"
          >
            {isAbandon ? 'Yes, Abandon 😔' : 'Yes, Reset 🔄'}
          </button>
        </div>
      </div>
    </div>
  )
}
