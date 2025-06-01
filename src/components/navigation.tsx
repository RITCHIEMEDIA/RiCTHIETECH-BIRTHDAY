"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Gift, Heart, Home, MessageCircle, Camera, Settings, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const pathname = usePathname()
  const { isAdmin, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: "/", label: "Celebration", icon: Home },
    { href: "/memories", label: "Memories", icon: Camera },
    { href: "/wishes", label: "Send Wishes", icon: MessageCircle },
    { href: "/gifts", label: "Send Gift", icon: Gift },
  ]

  const adminItems = isAdmin ? [{ href: "/admin", label: "Dashboard", icon: Settings }] : []

  if (!mounted || isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-pink-400" />
              <span className="text-xl font-bold text-white">Ritchie's Birthday</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-400" />
            <span className="text-xl font-bold text-white hidden sm:block">Ritchie's Birthday</span>
            <span className="text-lg font-bold text-white sm:hidden">Ritchie</span>
          </Link>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {isAdmin && (
              <>
                {adminItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white/20 hover:bg-white/10 transition-all duration-300"
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )
                })}
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-lg border-t border-white/10 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              {isAdmin && (
                <>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full justify-start text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
