"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Heart, Star } from "lucide-react"
import { supabase, type Wish } from "@/lib/supabase"

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [wishForm, setWishForm] = useState({
    name: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setWishes(data || [])
    } catch (error) {
      console.error("Error fetching wishes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase.from("wishes").insert([
        {
          name: wishForm.name,
          message: wishForm.message,
          is_public: true,
        },
      ])

      if (error) throw error

      setWishForm({ name: "", message: "" })
      fetchWishes() // Refresh the wishes
      alert("Your wish has been sent! 🎉")
    } catch (error) {
      console.error("Error submitting wish:", error)
      alert("Error sending wish. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading wishes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Birthday Wishes
          </h1>
          <p className="text-xl text-gray-200 mb-8">Send your heartfelt birthday wishes to Ritchie</p>
        </div>

        {/* Wish Form */}
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 mb-12">
          <form onSubmit={handleSubmitWish} className="space-y-6">
            <div className="text-center mb-6">
              <MessageCircle className="w-12 h-12 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white">Send Your Wishes</h3>
              <p className="text-gray-300">Share your birthday message for Ritchie</p>
            </div>

            <Input
              placeholder="Your name"
              value={wishForm.name}
              onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4"
              required
            />

            <Textarea
              placeholder="Write your birthday message here..."
              value={wishForm.message}
              onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4"
              rows={4}
              required
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-full"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Birthday Wish 🎉
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Wishes Display */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Recent Wishes ({wishes.length})</h2>

          {wishes.map((wish, index) => (
            <Card
              key={wish.id}
              className="p-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">{wish.name}</h4>
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-200 leading-relaxed mb-3">{wish.message}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(wish.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {wishes.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 text-xl">No wishes yet.</p>
            <p className="text-gray-400">Be the first to send a birthday wish!</p>
          </div>
        )}
      </div>
    </div>
  )
}
