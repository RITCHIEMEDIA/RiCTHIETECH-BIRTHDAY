"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out MetaMask-related errors
    if (error.message?.includes("MetaMask") || error.message?.includes("ChromeTransport")) {
      console.warn("MetaMask extension error detected and ignored:", error.message)
      // Reset the error boundary for MetaMask errors
      this.setState({ hasError: false })
      return
    }

    console.error("Application error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError && !this.state.error?.message?.includes("MetaMask")) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-300 mb-6">Don't worry, this happens sometimes. Let's try refreshing the page.</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
