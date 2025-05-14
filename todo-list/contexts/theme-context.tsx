"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"
import type { ReactNode } from "react"

interface ThemeContextValue {
  theme: string
  setTheme: (theme: string) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeContextProviderProps {
  children: ReactNode
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Determine if dark mode is active based on the resolved theme
    setIsDark(resolvedTheme === "dark")
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme: theme || "system",
        setTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider")
  }
  return context
}
