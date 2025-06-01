"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_PASSWORD = "ritchie2024" // Change this to a secure password

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (typeof window !== "undefined" && window.localStorage) {
          const adminStatus = localStorage.getItem("isAdmin")
          if (adminStatus === "true") {
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.warn("Auth initialization warning:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (password: string): boolean => {
    try {
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true)
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("isAdmin", "true")
        }
        return true
      }
      return false
    } catch (error) {
      console.warn("Login error:", error)
      return false
    }
  }

  const logout = () => {
    try {
      setIsAdmin(false)
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("isAdmin")
      }
    } catch (error) {
      console.warn("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
