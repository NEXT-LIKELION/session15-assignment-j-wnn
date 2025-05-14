"use client"

import { useState } from "react"
import { format, isSameMonth, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CustomCalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
  className?: string
}

export function CustomCalendar({ selected, onSelect, className }: CustomCalendarProps) {
  const [date, setDate] = useState<Date>(selected || new Date())

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

  const handleDateSelect = (day: Date) => {
    // Check if the day is in the same month 
    // (to prevent selecting days from prev/next month)
    if (isSameMonth(day, date)) {
      if (onSelect) {
        onSelect(day)
      }
    }
  }

  return (
    <div className={cn("p-3", className)}>
      {/* Calendar Header */}
      <div className="mb-3 relative flex items-center justify-center">
        <button
          onClick={goToPreviousMonth}
          className="absolute left-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <h2 className="text-center font-medium">{format(date, "MMMM yyyy")}</h2>
        
        <button
          onClick={goToNextMonth}
          className="absolute right-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays(date).map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(day)}
            className={cn(
              "h-8 w-8 flex items-center justify-center text-sm rounded-full",
              !isSameMonth(day, date) && "text-muted-foreground opacity-50",
              isSameMonth(day, date) && "hover:bg-gray-100 dark:hover:bg-gray-800",
              isToday(day) && "border border-primary",
              selected && isSameDay(day, selected) && "bg-primary text-primary-foreground"
            )}
            disabled={!isSameMonth(day, date)}
          >
            {format(day, "d")}
          </button>
        ))}
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

  // Calculate total days to show (35 or 42 = 5 or 6 weeks)
  const daysInMonth = lastDay.getDate()
  const totalDays = (daysFromPrevMonth + daysInMonth > 35) ? 42 : 35

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