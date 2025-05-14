"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/task"
import { TaskItem } from "@/components/task-item"
import { cn } from "@/lib/utils"

type TaskListProps = {
  tasks: Task[]
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskList({ tasks, onDelete, onToggleComplete, onEdit }: TaskListProps) {
  const [expandedCompletedTasks, setExpandedCompletedTasks] = useState<Record<string, boolean>>({
    high: false,
    medium: false,
    low: false,
  })

  // Group tasks by priority and completion status
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

  // Sort tasks by due date within each group
  const sortByDueDate = (a: Task, b: Task) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else if (a.dueDate) {
      return -1
    } else if (b.dueDate) {
      return 1
    }
    return 0
  }

  Object.keys(groupedTasks).forEach((priority) => {
    groupedTasks[priority as keyof typeof groupedTasks].active.sort(sortByDueDate)
    groupedTasks[priority as keyof typeof groupedTasks].completed.sort(sortByDueDate)
  })

  const toggleExpandCompletedTasks = (priority: string) => {
    setExpandedCompletedTasks((prev) => ({
      ...prev,
      [priority]: !prev[priority],
    }))
  }

  const renderTaskGroup = (priority: "high" | "medium" | "low") => {
    const { active, completed } = groupedTasks[priority]
    const hasCompletedTasks = completed.length > 0
    const hasMoreCompletedTasks = completed.length > 3
    const isExpanded = expandedCompletedTasks[priority]
    const displayedCompletedTasks = isExpanded ? completed : completed.slice(0, 3)

    const priorityColors = {
      high: "border-red-200 dark:border-red-900",
      medium: "border-yellow-200 dark:border-yellow-900",
      low: "border-green-200 dark:border-green-900",
    }

    const priorityHeaderColors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    }

    return (
      <div className={cn("rounded-lg border p-4", priorityColors[priority])}>
        <h2 className={cn("mb-4 rounded-md px-3 py-1 text-sm font-medium", priorityHeaderColors[priority])}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </h2>

        {active.length === 0 && !hasCompletedTasks ? (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No tasks</p>
          </div>
        ) : (
          <>
            {/* Active tasks */}
            {active.length > 0 && (
              <div className="space-y-3 mb-4">
                {active.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            )}

            {/* Completed tasks */}
            {hasCompletedTasks && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  {hasMoreCompletedTasks && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => toggleExpandCompletedTasks(priority)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" /> Show More
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div
                  className={cn("space-y-3", isExpanded && hasMoreCompletedTasks && "max-h-60 overflow-y-auto pr-2")}
                >
                  {displayedCompletedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onDelete={onDelete}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                    />
                  ))}

                  {!isExpanded && hasMoreCompletedTasks && (
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => toggleExpandCompletedTasks(priority)}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" /> {completed.length - 3} more items
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No tasks yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderTaskGroup("high")}
      {renderTaskGroup("medium")}
      {renderTaskGroup("low")}
    </div>
  )
}
