// Task related types
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: TaskPriority
  createdAt: string
  dueDate?: string
}

// Theme related types
export type Theme = "light" | "dark" | "system"
