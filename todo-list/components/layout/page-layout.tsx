import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
