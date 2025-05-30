"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Update the state with the current value
      setMatches(media.matches)

      // Create an event listener
      const listener = () => setMatches(media.matches)

      // Listen for changes
      media.addEventListener("change", listener)

      // Remove the listener when the component is unmounted
      return () => media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
