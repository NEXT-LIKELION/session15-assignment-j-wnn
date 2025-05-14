"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Task, TaskPriority } from "@/types/index"
import { useTodo } from "@/contexts/todo-context"
import { toast } from "@/hooks/use-toast"

interface TaskFormProps {
  editingTask: Task | null
  onCancelEdit: () => void
}

export function TaskForm({ editingTask, onCancelEdit }: TaskFormProps) {
  const { addTask, updateTask } = useTodo()
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<TaskPriority | "">("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Update form when editing task changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setPriority(editingTask.priority)

      // Properly parse the date from the ISO string
      if (editingTask.dueDate) {
        try {
          const date = new Date(editingTask.dueDate)
          if (!isNaN(date.getTime())) {
            setSelectedDate(date)
          }
        } catch (error) {
          console.error("Error parsing date:", error)
          setSelectedDate(undefined)
        }
      } else {
        setSelectedDate(undefined)
      }
    } else {
      setTitle("")
      setPriority("")
      setSelectedDate(undefined)
    }
  }, [editingTask])

  // Reset states after form submission
  const resetForm = () => {
    setTitle("")
    setPriority("")
    setSelectedDate(undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({ title: "Please enter a task" })
      return
    }

    if (!title.trim()) return

    // Create a valid ISO string for the due date
    const dueDate = selectedDate ? selectedDate.toISOString() : undefined

    // Priority, Due Date 체크
    if (!priority) {
      toast({ title: "Please select a priority" })
      return
    }
    if (!dueDate) {
      toast({ title: "Please select a due date" })
      return
    }

    if (editingTask) {
      updateTask({
        ...editingTask,
        title,
        priority: priority as TaskPriority,
        dueDate,
      })
    } else {
      addTask({
        title,
        completed: false,
        priority: priority as TaskPriority,
        dueDate,
      })
    }

    resetForm()
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    // Close the calendar after selection
    setIsCalendarOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="task-title" className="text-sm font-medium">
            Task
          </label>
          <Input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="task-priority" className="text-sm font-medium">
              Priority
            </label>
            <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
              <SelectTrigger id="task-priority" className="w-full placeholder:text-muted-foreground">
                <SelectValue placeholder="Select priority" className="text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="due-date" className="text-sm font-medium">
              Due Date
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar selected={selectedDate} onSelect={handleDateSelect} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          {editingTask && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button type="submit">{editingTask ? "Update Task" : "Add Task"}</Button>
        </div>
      </div>
    </form>
  )
}
