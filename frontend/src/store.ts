import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  est_minutes: number
  energy: 'low' | 'medium' | 'high'
  status: 'open' | 'done' | 'abandoned'
  created_at: string
  updated_at?: string
  selected?: boolean
}

export interface TimerState {
  taskId: string | null
  sessionId: string | null
  startTime: number | null
  endTime: number | null
  isRunning: boolean
  isPaused: boolean
  estimatedMinutes: number
}

interface AppState {
  // Device and sync
  deviceId: string
  isOnline: boolean
  lastSyncAt: string | null
  
  // Tasks
  tasks: Task[]
  selectedTaskIds: string[]
  
  // Timer
  timer: TimerState
  
  // Actions
  setDeviceId: (id: string) => void
  setOnline: (online: boolean) => void
  setLastSync: (timestamp: string) => void
  
  // Task actions
  addTasks: (tasks: Omit<Task, 'id' | 'created_at'>[]) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskSelection: (id: string) => void
  clearSelection: () => void
  setTasks: (tasks: Task[]) => void
  
  // Timer actions
  startTimer: (taskId: string, estimatedMinutes: number, sessionId?: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  completeTimer: (success: boolean) => void
}

// Generate device ID
const generateDeviceId = (): string => {
  return 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      deviceId: '',
      isOnline: navigator.onLine,
      lastSyncAt: null,
      tasks: [],
      selectedTaskIds: [],
      timer: {
        taskId: null,
        sessionId: null,
        startTime: null,
        endTime: null,
        isRunning: false,
        isPaused: false,
        estimatedMinutes: 0
      },

      // Device and sync actions
      setDeviceId: (id: string) => set({ deviceId: id }),
      
      setOnline: (online: boolean) => set({ isOnline: online }),
      
      setLastSync: (timestamp: string) => set({ lastSyncAt: timestamp }),

      // Task actions
      addTasks: (newTasks) => set((state) => {
        const tasksWithIds = newTasks.map(task => ({
          ...task,
          id: 'task_' + Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          status: task.status || 'open' as const
        }))
        
        return {
          tasks: [...state.tasks, ...tasksWithIds]
        }
      }),

      updateTask: (id: string, updates: Partial<Task>) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        )
      })),

      deleteTask: (id: string) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id),
        selectedTaskIds: state.selectedTaskIds.filter(taskId => taskId !== id)
      })),

      toggleTaskSelection: (id: string) => set((state) => {
        const isSelected = state.selectedTaskIds.includes(id)
        return {
          selectedTaskIds: isSelected
            ? state.selectedTaskIds.filter(taskId => taskId !== id)
            : [...state.selectedTaskIds, id]
        }
      }),

      clearSelection: () => set({ selectedTaskIds: [] }),

      setTasks: (tasks: Task[]) => set({ tasks }),

      // Timer actions
      startTimer: (taskId: string, estimatedMinutes: number, sessionId?: string) => {
        const now = Date.now()
        const endTime = now + (estimatedMinutes * 60 * 1000)
        
        set({
          timer: {
            taskId,
            sessionId: sessionId || null,
            startTime: now,
            endTime,
            isRunning: true,
            isPaused: false,
            estimatedMinutes
          }
        })
      },

      pauseTimer: () => set((state) => {
        if (!state.timer.isRunning || !state.timer.startTime) return state
        
        const now = Date.now()
        const elapsed = now - state.timer.startTime
        const remaining = state.timer.estimatedMinutes * 60 * 1000 - elapsed
        
        return {
          timer: {
            ...state.timer,
            isRunning: false,
            isPaused: true,
            // Store remaining time by adjusting estimated minutes
            estimatedMinutes: Math.max(0, Math.ceil(remaining / (60 * 1000)))
          }
        }
      }),

      resumeTimer: () => set((state) => {
        if (!state.timer.isPaused) return state
        
        const now = Date.now()
        const endTime = now + (state.timer.estimatedMinutes * 60 * 1000)
        
        return {
          timer: {
            ...state.timer,
            startTime: now,
            endTime,
            isRunning: true,
            isPaused: false
          }
        }
      }),

      resetTimer: () => set((state) => ({
        timer: {
          ...state.timer,
          startTime: null,
          endTime: null,
          isRunning: false,
          isPaused: false
        }
      })),

      completeTimer: (success: boolean) => set((state) => {
        // Update task status
        if (state.timer.taskId) {
          const updatedTasks = state.tasks.map(task =>
            task.id === state.timer.taskId
              ? { 
                  ...task, 
                  status: success ? 'done' as const : 'abandoned' as const,
                  updated_at: new Date().toISOString()
                }
              : task
          )
          
          return {
            tasks: updatedTasks,
            timer: {
              taskId: null,
              sessionId: null,
              startTime: null,
              endTime: null,
              isRunning: false,
              isPaused: false,
              estimatedMinutes: 0
            }
          }
        }
        
        return {
          timer: {
            taskId: null,
            sessionId: null,
            startTime: null,
            endTime: null,
            isRunning: false,
            isPaused: false,
            estimatedMinutes: 0
          }
        }
      })
    }),
    {
      name: 'routine-roulette-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        tasks: state.tasks,
        selectedTaskIds: state.selectedTaskIds,
        lastSyncAt: state.lastSyncAt
      }),
      onRehydrateStorage: () => (state) => {
        // Generate device ID if not present
        if (state && !state.deviceId) {
          state.setDeviceId(generateDeviceId())
        }
        
        // Set online status
        if (state) {
          state.setOnline(navigator.onLine)
        }
      }
    }
  )
)

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useStore.getState().setOnline(true)
  })
  
  window.addEventListener('offline', () => {
    useStore.getState().setOnline(false)
  })
}
