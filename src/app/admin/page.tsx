"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Gift, Camera, Check, X, Calendar, Plus, Upload, DollarSign } from "lucide-react"
import { supabase, type Wish, type Memory, type Gift as GiftType } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import { AdminLogin } from "@/components/admin-login"

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [wishes, setWishes] = useState<Wish[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddMemory, setShowAddMemory] = useState(false)
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    imageUrl: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (isAdmin) {
      fetchAllData()
    }
  }, [isAdmin])

  const fetchAllData = async () => {
    try {
      const [wishesRes, memoriesRes, giftsRes] = await Promise.all([
        supabase.from("wishes").select("*").order("created_at", { ascending: false }),
        supabase.from("memories").select("*").order("created_at", { ascending: false }),
        supabase.from("gifts").select("*").order("created_at", { ascending: false }),
      ])

      setWishes(wishesRes.data || [])
      setMemories(memoriesRes.data || [])
      setGifts(giftsRes.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveMemory = async (id: string) => {
    try {
      const { error } = await supabase.from("memories").update({ is_approved: true }).eq("id", id)

      if (error) throw error
      fetchAllData()
    } catch (error) {
      console.error("Error approving memory:", error)
    }
  }

  const addMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = newMemory.imageUrl

    try {
      // If a file is selected, upload it to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from("memories")
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("memories")
          .getPublicUrl(fileName)
        imageUrl = publicUrlData.publicUrl
      }

      const { error } = await supabase.from("memories").insert([
        {
          title: newMemory.title,
          description: newMemory.description,
          image_url: imageUrl,
          is_approved: true,
        },
      ])

      if (error) throw error

      setNewMemory({ title: "", description: "", imageUrl: "" })
      setImageFile(null)
      setShowAddMemory(false)
      fetchAllData()
      alert("Memory added successfully!")
    } catch (error) {
      console.error("Error adding memory:", error)
      alert("Error adding memory. Please try again.")
    }
  }

  const deleteItem = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) throw error
      fetchAllData()
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (!isAdmin) {
    return <AdminLogin />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  const stats = {
    totalWishes: wishes.length,
    totalMemories: memories.length,
    approvedMemories: memories.filter((m) => m.is_approved).length,
    pendingMemories: memories.filter((m) => !m.is_approved).length,
    totalGifts: gifts.length,
    totalGiftAmount: gifts.reduce((sum, gift) => sum + (gift.amount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-200">Manage your birthday celebration platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <div className="text-3xl font-bold text-white">{stats.totalWishes}</div>
            <div className="text-gray-300">Birthday Wishes</div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 text-center">
            <Camera className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <div className="text-3xl font-bold text-white">
              {stats.approvedMemories}/{stats.totalMemories}
            </div>
            <div className="text-gray-300">Approved Memories</div>
            {stats.pendingMemories > 0 && <Badge className="mt-2 bg-yellow-600">{stats.pendingMemories} pending</Badge>}
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 text-center">
            <Gift className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
            <div className="text-3xl font-bold text-white">{stats.totalGifts}</div>
            <div className="text-gray-300">Gift Notifications</div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 text-center">
            <DollarSign className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <div className="text-3xl font-bold text-green-400">₦{stats.totalGiftAmount.toLocaleString()}</div>
            <div className="text-gray-300">Total Gift Amount</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="wishes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md text-sm md:text-base">
            <TabsTrigger value="wishes" className="data-[state=active]:bg-white/20">
              Wishes ({wishes.length})
            </TabsTrigger>
            <TabsTrigger value="memories" className="data-[state=active]:bg-white/20">
              Memories ({memories.length})
            </TabsTrigger>
            <TabsTrigger value="gifts" className="data-[state=active]:bg-white/20">
              Gifts ({gifts.length})
            </TabsTrigger>
          </TabsList>

          {/* Wishes Tab */}
          <TabsContent value="wishes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Birthday Wishes</h2>
              <Badge className="bg-green-600">{wishes.length} total wishes</Badge>
            </div>
            {wishes.map((wish) => (
              <Card key={wish.id} className="p-4 md:p-6 bg-white/10 backdrop-blur-md border-white/20 smooth-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{wish.name}</h4>
                      <Badge variant={wish.is_public ? "default" : "secondary"}>
                        {wish.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <p className="text-gray-200 mb-3 leading-relaxed">{wish.message}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(wish.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteItem("wishes", wish.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Memory Gallery</h2>
              <Button
                onClick={() => setShowAddMemory(!showAddMemory)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </div>

            {/* Add Memory Form */}
            {showAddMemory && (
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <form onSubmit={addMemory} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Add New Memory</h3>
                  <Input
                    placeholder="Memory title"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Textarea
                    placeholder="Memory description"
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    rows={3}
                  />
                  <div>
                    <label className="block text-white font-medium mb-2">Image (Upload or URL)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 mb-2"
                    />
                    <Input
                      placeholder="Or paste image URL"
                      value={newMemory.imageUrl}
                      onChange={(e) => setNewMemory({ ...newMemory, imageUrl: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Add Memory
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddMemory(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {memories.map((memory) => (
              <Card key={memory.id} className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex items-start gap-4">
                  <img
                    src={memory.image_url || "/placeholder.svg?height=100&width=100"}
                    alt={memory.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{memory.title}</h4>
                      <Badge variant={memory.is_approved ? "default" : "secondary"}>
                        {memory.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-gray-200 mb-3">{memory.description}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(memory.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!memory.is_approved && (
                      <Button
                        onClick={() => approveMemory(memory.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteItem("memories", memory.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Gifts Tab */}
          <TabsContent value="gifts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gift Notifications</h2>
              <div className="flex gap-4">
                <Badge className="bg-green-600">₦{stats.totalGiftAmount.toLocaleString()} total</Badge>
                <Badge className="bg-blue-600">{gifts.length} notifications</Badge>
              </div>
            </div>
            {gifts.map((gift) => (
              <Card key={gift.id} className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{gift.name}</h4>
                      {gift.amount && (
                        <Badge className="bg-green-600 text-lg px-3 py-1">₦{gift.amount.toLocaleString()}</Badge>
                      )}
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-gray-300">
                        <span className="font-semibold">Email:</span> {gift.email}
                      </p>
                      {gift.payment_method && (
                        <p className="text-gray-300">
                          <span className="font-semibold">Payment Method:</span> {gift.payment_method}
                        </p>
                      )}
                      {gift.message && (
                        <p className="text-gray-200">
                          <span className="font-semibold">Message:</span> {gift.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(gift.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteItem("gifts", gift.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
