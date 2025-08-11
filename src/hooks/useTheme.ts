import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ThemeMode = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  theme: ThemeMode
  actualTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  isDarkMode: boolean
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Calculate actual theme
  const actualTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme
  const isDarkMode = actualTheme === 'dark'

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])

  return {
    theme,
    actualTheme,
    setTheme,
    isDarkMode
  }
}