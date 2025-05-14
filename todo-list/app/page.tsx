"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import type { Task } from "@/types/index"

export default function HomePage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <TaskForm editingTask={editingTask} onCancelEdit={handleCancelEdit} />
        <TaskList />
      </div>
    </PageLayout>
  )
}
