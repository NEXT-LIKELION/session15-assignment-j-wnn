import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { TodoProvider } from "@/contexts/todo-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeContextProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "To Do List",
  description: "A simple to-do list application with calendar",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TodoProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeContextProvider>{children}</ThemeContextProvider>
          </ThemeProvider>
        </TodoProvider>
        <Toaster />
      </body>
    </html>
  )
}
