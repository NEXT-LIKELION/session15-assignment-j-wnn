import { PageLayout } from "@/components/layout/page-layout"
import { CalendarView } from "@/components/calendar/calendar-view"

export default function CalendarPage() {
  return (
    <PageLayout children={<CalendarView />} />
  )
}
