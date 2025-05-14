"use client"

import { useState } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsButton } from "@/components/settings-button"
import { Calendar, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTodo } from "@/contexts/todo-context"
import type { Task } from "@/types/task"

export default function TodoApp() {
  const { tasks, username, addTask, updateTask, deleteTask, toggleComplete, setUsername } = useTodo()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleUpdateTask = (task: Task) => {
    updateTask(task)
    setEditingTask(null)
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
  }

  const cancelEditing = () => {
    setEditingTask(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {username}</h1>
        <div className="flex items-center gap-2">
          <Link href="/calendar">
            <Button variant="outline" size="icon" aria-label="Calendar view">
              <Calendar className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <SettingsButton username={username} onUsernameChange={setUsername} />
          <ThemeToggle />
        </div>
      </div>

      <TaskForm
        onAddTask={addTask}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
        onCancelEdit={cancelEditing}
      />

      <div className="mt-6">
        <TaskList tasks={tasks} onDelete={deleteTask} onToggleComplete={toggleComplete} onEdit={startEditing} />
      </div>
    </div>
  )
}
