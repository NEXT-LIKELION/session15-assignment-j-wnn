"use client"

import { useState } from "react"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Task, TaskPriority } from "@/types/index"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  isEditing?: boolean
  onUpdate?: (task: Task) => void
  onCancelEdit?: () => void
}

export function TaskItem({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
  isEditing = false,
  onUpdate,
  onCancelEdit,
}: TaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority)

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  const handleUpdate = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate({
        ...task,
        title: editTitle,
        priority: editPriority,
      })
    }
  }

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col gap-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="w-full"
          />
          <Select value={editPriority} onValueChange={(value: TaskPriority) => setEditPriority(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "p-3 rounded-lg shadow-sm border flex items-start gap-2 transition-opacity",
        task.completed && "opacity-60",
        isOverdue && !task.completed && "border-red-500 dark:border-red-700",
      )}
    >
      <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1 flex-wrap">
          <h3
            className={cn(
              "font-medium text-sm break-words",
              task.completed && "line-through text-muted-foreground",
              isOverdue && !task.completed && "text-red-600 dark:text-red-400",
            )}
          >
            {task.title}
          </h3>
        </div>

        {task.dueDate && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground",
              isOverdue && "text-red-600 dark:text-red-400 font-medium",
            )}
          >
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
            {isOverdue && " (Overdue)"}
          </p>
        )}
      </div>

      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-6 w-6" aria-label="Edit task">
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-6 w-6 text-destructive hover:text-destructive"
          aria-label="Delete task"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
