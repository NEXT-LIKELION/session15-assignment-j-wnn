"use client"

import { useState } from "react"
import { TaskItem } from "@/components/tasks/task-item"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskPriority } from "@/types/index"

interface TaskGroupProps {
  title: string
  priority: TaskPriority
  activeTasks: Task[]
  completedTasks: Task[]
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskGroup({
  title,
  priority,
  activeTasks,
  completedTasks,
  onDelete,
  onToggleComplete,
  onEdit,
}: TaskGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasCompletedTasks = completedTasks.length > 0
  const hasMoreCompletedTasks = completedTasks.length > 3
  const displayedCompletedTasks = isExpanded ? completedTasks : completedTasks.slice(0, 3)

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
      <h2 className={cn("mb-4 rounded-md px-3 py-1 text-sm font-medium", priorityHeaderColors[priority])}>{title}</h2>

      {activeTasks.length === 0 && !hasCompletedTasks ? (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No tasks</p>
        </div>
      ) : (
        <>
          {/* Active tasks */}
          {activeTasks.length > 0 && (
            <div className="space-y-3 mb-4">
              {activeTasks.map((task) => (
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
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsExpanded(!isExpanded)}>
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

              <div className={cn("space-y-3", isExpanded && hasMoreCompletedTasks && "max-h-60 overflow-y-auto pr-2")}>
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
                  <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setIsExpanded(true)}>
                    <ChevronDown className="h-4 w-4 mr-1" /> {completedTasks.length - 3} more items
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
