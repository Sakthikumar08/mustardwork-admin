"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} })

export const ThemeProvider = ({ children }) => {
  const getPreferred = () => {
    const saved = localStorage.getItem("admin-theme")
    if (saved === "light" || saved === "dark") return saved
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
  }

  const [theme, setTheme] = useState("light")

  useEffect(() => {
    setTheme(getPreferred())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("admin-theme", theme)
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
