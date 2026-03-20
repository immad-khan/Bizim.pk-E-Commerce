'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'light') {
      root.style.setProperty('--background', '#ffffff')
      root.style.setProperty('--foreground', '#000000')
      root.style.setProperty('--card', '#f5f5f5')
      root.style.setProperty('--card-foreground', '#000000')
      root.style.setProperty('--secondary', '#e0e0e0')
      root.style.setProperty('--muted-foreground', '#666666')
    } else {
      root.style.setProperty('--background', '#0f0f0f')
      root.style.setProperty('--foreground', '#ffffff')
      root.style.setProperty('--card', '#1a1a1a')
      root.style.setProperty('--card-foreground', '#ffffff')
      root.style.setProperty('--secondary', '#2a2a2a')
      root.style.setProperty('--muted-foreground', '#cccccc')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return children

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
