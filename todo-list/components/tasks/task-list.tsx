"use client"

import { useState } from "react"
import { TaskItem } from "@/components/tasks/task-item"
import { TaskGroup } from "@/components/tasks/task-group"
import type { Task } from "@/types/index"
import { useTodo } from "@/contexts/todo-context"

export function TaskList() {
  const { tasks, deleteTask, toggleComplete, updateTask } = useTodo()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Group tasks by priority
  const groupedTasks = {
    high: {
      active: tasks.filter((task) => task.priority === "high" && !task.completed),
      completed: tasks.filter((task) => task.priority === "high" && task.completed),
    },
    medium: {
      active: tasks.filter((task) => task.priority === "medium" && !task.completed),
      completed: tasks.filter((task) => task.priority === "medium" && task.completed),
    },
    low: {
      active: tasks.filter((task) => task.priority === "low" && !task.completed),
      completed: tasks.filter((task) => task.priority === "low" && task.completed),
    },
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No tasks yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div>
      {editingTask && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Edit Task</h2>
          <TaskItem
            task={editingTask}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
            onEdit={() => {}} // No-op since we're already editing
            isEditing={true}
            onUpdate={(updatedTask) => {
              updateTask(updatedTask)
              setEditingTask(null)
            }}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskGroup
          title="High Priority"
          priority="high"
          activeTasks={groupedTasks.high.active}
          completedTasks={groupedTasks.high.completed}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
        />
        <TaskGroup
          title="Medium Priority"
          priority="medium"
          activeTasks={groupedTasks.medium.active}
          completedTasks={groupedTasks.medium.completed}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
        />
        <TaskGroup
          title="Low Priority"
          priority="low"
          activeTasks={groupedTasks.low.active}
          completedTasks={groupedTasks.low.completed}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  )
}
