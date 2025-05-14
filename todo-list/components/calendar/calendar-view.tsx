"use client"

import { useState } from "react"
import { format, isSameMonth, isSameDay, parseISO, isValid } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTodo } from "@/contexts/todo-context"
import type { Task } from "@/types/index"

export function CalendarView() {
  const { tasks } = useTodo()
  const [date, setDate] = useState<Date>(new Date())
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  // Filter for uncompleted tasks with due dates
  const tasksWithDueDate = tasks.filter((task) => !task.completed && task.dueDate)

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {}
  tasksWithDueDate.forEach((task) => {
    if (task.dueDate) {
      try {
        // Safely parse the date and create a key
        const dueDate = parseISO(task.dueDate)
        if (isValid(dueDate)) {
          const dateKey = format(dueDate, "yyyy-MM-dd")
          if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = []
          }
          tasksByDate[dateKey].push(task)
        }
      } catch (error) {
        console.error("Error parsing date:", error)
      }
    }
  })

  const toggleExpandDay = (dateKey: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }))
  }

  // Custom day renderer
  const renderDayContent = (day: Date) => {
    // Ensure day is a valid date
    if (!isValid(day)) {
      return null
    }

    const dateKey = format(day, "yyyy-MM-dd")
    const dayTasks = tasksByDate[dateKey] || []
    const hasMoreTasks = dayTasks.length > 5
    const isExpanded = expandedDays[dateKey]
    const displayedTasks = isExpanded ? dayTasks : dayTasks.slice(0, 5)

    const priorityColors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/40",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/40",
      low: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800/40",
    }

    return (
      <>
        <div className="text-center p-1">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              !isSameMonth(day, date) && "text-muted-foreground opacity-50",
              isSameDay(day, new Date()) && "bg-primary text-primary-foreground",
            )}
          >
            {format(day, "d")}
          </span>
        </div>
        {dayTasks.length > 0 && (
          <div className={cn("px-1 pb-1", isExpanded && dayTasks.length > 5 && "max-h-40 overflow-y-auto")}>
            {displayedTasks.map((task) => (
              <div
                key={task.id}
                className={cn("mb-1 px-1 py-0.5 text-xs rounded border truncate", priorityColors[task.priority])}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {hasMoreTasks && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleExpandDay(dateKey)
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? "Show less" : `+${dayTasks.length - 5} more`}
              </button>
            )}
          </div>
        )}
      </>
    )
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    setDate(new Date())
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday} className="ml-2">
                Today
              </Button>
            </div>
            <h2 className="text-xl font-semibold">{format(date, "MMMM yyyy")}</h2>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mt-1">
              {generateCalendarDays(date).map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-24 border p-0 relative",
                    !isSameMonth(day, date) && "opacity-50 bg-muted/20",
                    isSameDay(day, date) && "ring-2 ring-primary",
                  )}
                >
                  {renderDayContent(day)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Low</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate calendar days
function generateCalendarDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate days from previous month to show
  const daysFromPrevMonth = firstDayOfWeek

  // Calculate total days to show (42 = 6 weeks)
  const totalDays = 42

  const days: Date[] = []

  // Add days from previous month
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i)
    days.push(prevMonthDay)
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  // Add days from next month to fill the grid
  const remainingDays = totalDays - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
}
