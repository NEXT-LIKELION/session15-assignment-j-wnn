"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Task } from "@/types/index"
import { taskService } from "@/lib/firebase"

interface TodoContextValue {
  tasks: Task[]
  username: string
  addTask: (taskData: Omit<Task, "id" | "createdAt">) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string) => Promise<void>
  setUsername: (name: string) => void
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined)

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "User"
    }
    return "User"
  })

  // Load tasks from Firebase for specific user
  useEffect(() => {
    if (!username) return

    const unsubscribe = taskService.subscribeToTasks(username, (loadedTasks) => {
      setTasks(loadedTasks)
    })

    return () => unsubscribe()
  }, [username])

  // Save username to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("username", username)
    } catch (error) {
      console.error("Error saving username to localStorage:", error)
    }
  }, [username])

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      await taskService.addTask(username, taskData)
    } catch (error) {
      console.error("Error adding task:", error)
      throw error
    }
  }

  const updateTask = async (updatedTask: Task) => {
    try {
      await taskService.updateTask(username, updatedTask)
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(username, id)
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  const toggleComplete = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return

      await taskService.toggleTaskCompletion(username, id, !task.completed)
    } catch (error) {
      console.error("Error toggling task completion:", error)
      throw error
    }
  }

  const contextValue: TodoContextValue = {
    tasks,
    username,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setUsername,
  }

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider")
  }
  return context
}
