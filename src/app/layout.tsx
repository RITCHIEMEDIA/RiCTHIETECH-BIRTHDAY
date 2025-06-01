import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/lib/auth"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "Happy Birthday Ritchie! 🎉",
  description: "A special birthday celebration for Isaac Elisha (Ritchie)",
  robots: "noindex, nofollow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <Navigation />
            <main className="pt-16">{children}</main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
