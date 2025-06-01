"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Heart, Star, Sparkles, Camera, MessageCircle, PartyPopper } from "lucide-react"
import Link from "next/link"

export default function CelebrationPage() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; color: string; rotation: number; size: number }>
  >([])
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; y: number; color: string; sway: number }>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const createConfetti = () => {
    if (!mounted) return

    const colors = ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#9370DB", "#32CD32"]
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      size: Math.random() * 4 + 2,
    }))
    setConfetti(newConfetti)
  }

  const createBalloons = () => {
    if (!mounted) return

    const colors = ["#FF69B4", "#00CED1", "#FFD700", "#9370DB", "#FF6347"]
    const newBalloons = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 10 + i * 15,
      y: 70 + Math.random() * 15,
      color: colors[i % colors.length],
      sway: (Math.random() * 1 - 0.5) * 0.5,
    }))
    setBalloons(newBalloons)
  }

  const startCelebration = () => {
    setShowAnimation(true)
    setTimeout(() => {
      createConfetti()
      createBalloons()
    }, 100)
  }

  useEffect(() => {
    if (!mounted || confetti.length === 0) return

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            y: piece.y + 1,
            rotation: piece.rotation + 2,
          }))
          .filter((piece) => piece.y < 110),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [confetti, mounted])

  useEffect(() => {
    if (!mounted || balloons.length === 0) return

    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((balloon) => ({
          ...balloon,
          x: balloon.x + balloon.sway * 0.2,
          sway: balloon.x > 85 || balloon.x < 15 ? -balloon.sway : balloon.sway,
        })),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [balloons, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading celebration...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 15 + 8}px`,
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-full animate-pulse pointer-events-none"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`,
            transition: "all 0.05s linear",
          }}
        />
      ))}

      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute transition-all duration-100 ease-linear pointer-events-none"
          style={{
            left: `${balloon.x}%`,
            top: `${balloon.y}%`,
          }}
        >
          <div
            className="w-8 h-10 md:w-10 md:h-12 rounded-full shadow-lg relative animate-pulse"
            style={{
              backgroundColor: balloon.color,
              animationDelay: `${balloon.id * 0.5}s`,
              animationDuration: "3s",
            }}
          >
            <div className="absolute top-full left-1/2 w-px h-16 md:h-20 bg-gray-400 transform -translate-x-1/2"></div>
          </div>
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
        {!showAnimation ? (
          <Card className="p-4 sm:p-8 md:p-12 bg-white/10 backdrop-blur-md border-white/20 text-center max-w-lg sm:max-w-2xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                  <PartyPopper className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Welcome, friends!</h1>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                  Ritchie's Birthday
                </h2>
                <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Celebration!
                </h3>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed">
                I’m so glad you’re here to celebrate with me! 🎉<br />
                Please scroll down and:
                <br />– Share your favorite memory with me<br />
                – Leave a birthday wish<br />
                – Or send a special gift if you’d like!
              </p>
              <Button
                onClick={startCelebration}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-4 sm:px-12 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                🎉 Start the Celebration! 🎉
              </Button>
            </div>
          </Card>
        ) : (
          <div className="text-center space-y-8 sm:space-y-12 max-w-2xl sm:max-w-6xl mx-auto">
            {/* Animated Title */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                HAPPY
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-fade-in-delay">
                BIRTHDAY
              </h1>
            </div>

            {/* Name */}
            <div className="space-y-2 sm:space-y-6">
              <p className="text-xl sm:text-3xl md:text-4xl text-white animate-pulse">🎂 To the Amazing 🎂</p>
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-yellow-400 animate-typewriter">
                ISAAC ELISHA
              </h2>
              <p className="text-xl sm:text-3xl md:text-5xl text-pink-400 font-semibold animate-pulse">(RITCHIE)</p>
            </div>

            {/* Birthday Message */}
            <Card className="p-4 sm:p-8 md:p-12 bg-white/10 backdrop-blur-md border-white/20 max-w-lg sm:max-w-5xl mx-auto">
              <div className="space-y-4 sm:space-y-8 text-white">
                <Heart className="w-10 h-10 sm:w-16 sm:h-16 mx-auto text-red-400 animate-pulse" />
                <p className="text-lg sm:text-2xl md:text-3xl leading-relaxed font-semibold">
                  Welcome to my special celebration space! 🎉
                </p>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-200">
                  Here’s how you can join the fun:
                  <br />– Tap “Memory Gallery” to upload a photo or memory you have with me.
                  <br />– Tap “Send Wishes” to write your birthday message.
                  <br />– Or tap “Send a Gift” if you want to make my day extra special!
                  <br /><br />
                  Thank you for being part of my journey. Your love and friendship mean the world to me!
                </p>
                <div className="flex justify-center space-x-2 sm:space-x-6 text-2xl sm:text-4xl">
                  <span className="animate-bounce">🎈</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                    🎁
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                    🎊
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>
                    🎉
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                    🥳
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.5s" }}>
                    🍰
                  </span>
                </div>
              </div>
            </Card>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-16">
              <Link href="/memories">
                <Card className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group transform hover:scale-105">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Memory Gallery</h3>
                    <p className="text-gray-300 text-base sm:text-lg">Share your favorite photos and stories with me!</p>
                  </div>
                </Card>
              </Link>

              <Link href="/wishes">
                <Card className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group transform hover:scale-105">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Send Wishes</h3>
                    <p className="text-gray-300 text-base sm:text-lg">Write your birthday message for me here!</p>
                  </div>
                </Card>
              </Link>

              <Link href="/gifts">
                <Card className="p-6 sm:p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group transform hover:scale-105">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Send a Gift</h3>
                    <p className="text-gray-300 text-base sm:text-lg">Make my day extra special with a gift!</p>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-16">
              <Button
                onClick={createConfetti}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                More Confetti!
              </Button>
              <Button
                onClick={createBalloons}
                className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                🎈 More Balloons!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
