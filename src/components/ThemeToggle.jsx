"use client"

import { useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-lg p-2.5 transition-all hover:bg-surface-2 border border-token ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-app" />
      ) : (
        <Moon className="w-5 h-5 text-app" />
      )}
    </button>
  )
}

export default ThemeToggle
