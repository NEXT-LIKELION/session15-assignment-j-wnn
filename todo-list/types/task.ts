export type Task = {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: string
  dueDate?: string // Optional due date field
}
