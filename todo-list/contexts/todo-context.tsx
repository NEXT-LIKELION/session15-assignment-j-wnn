"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Task } from "@/types/index"

interface TodoContextValue {
  tasks: Task[]
  username: string
  addTask: (taskData: Omit<Task, "id" | "createdAt">) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
  setUsername: (name: string) => void
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined)

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTasks = localStorage.getItem("tasks")
        return savedTasks ? JSON.parse(savedTasks) : []
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error)
        return []
      }
    }
    return []
  })

  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "User"
    }
    return "User"
  })

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }, [tasks])

  // Save username to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("username", username)
    } catch (error) {
      console.error("Error saving username to localStorage:", error)
    }
  }, [username])

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
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
