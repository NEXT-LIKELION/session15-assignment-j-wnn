"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SettingsButton } from "@/components/ui/settings-button"
import { LayoutGrid, Calendar, Network } from "lucide-react"
import { useTodo } from "@/contexts/todo-context"
import { usePathname } from "next/navigation"

export function Header() {
  const { username, setUsername } = useTodo()
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {username}</h1>
        <div className="flex items-center gap-2">
          {pathname !== "/" && (
            <Link href="/">
              <Button variant="outline" size="icon" aria-label="Go to task list">
                <LayoutGrid className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
          )}

          {pathname !== "/calendar" && (
            <Link href="/calendar">
              <Button variant="outline" size="icon" aria-label="Go to calendar view">
                <Calendar className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
          )}

          <SettingsButton username={username} onUsernameChange={setUsername} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
