"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { login, isLoading } = useAuth()

  useEffect(() => {
    // Ensure we're on the client side before rendering interactive elements
    setIsClient(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const success = login(password)
      if (success) {
        setError("")
        setPassword("")
      } else {
        setError("Invalid password. Please try again.")
      }
    } catch (error) {
      console.warn("Login attempt error:", error)
      setError("Login failed. Please try again.")
    }
  }

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-white text-xl animate-pulse">Loading admin login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-300">Enter password to access dashboard</p>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-12 text-lg py-3"
              required
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-2"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 text-lg font-semibold transition-all duration-300"
            disabled={!password.trim()}
          >
            Login to Dashboard
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Default password: <code className="bg-white/10 px-2 py-1 rounded text-gray-300">0000</code>
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}
