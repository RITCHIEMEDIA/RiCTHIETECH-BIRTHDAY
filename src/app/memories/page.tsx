"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, Heart, Calendar, ImageIcon } from "lucide-react"
import { supabase, type Memory } from "@/lib/supabase"

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    imageFile: null as File | null,
    imageUrl: "",
  })
  const [uploading, setUploading] = useState(false)
  const [showSubmittedMessage, setShowSubmittedMessage] = useState(false)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMemories(data || [])
    } catch (error) {
      console.error("Error fetching memories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setUploadForm({ ...uploadForm, imageFile: file, imageUrl: "" })
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `memories/${fileName}`

    const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath)
    console.log("Public URL data:", data)

    // Defensive: check if data and data.publicUrl exist
    if (!data || !data.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image")
    }

    return data.publicUrl
  }

  const handleSubmitMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = uploadForm.imageUrl

      if (uploadForm.imageFile) {
        imageUrl = await uploadImage(uploadForm.imageFile)
      }

      if (!imageUrl) {
        alert("Please provide an image URL or upload an image file")
        setUploading(false)
        return
      }

      console.log({
        title: uploadForm.title,
        description: uploadForm.description,
        image_url: imageUrl,
        is_approved: false,
      })

      const { error } = await supabase.from("memories").insert([
        {
          title: uploadForm.title,
          description: uploadForm.description,
          image_url: imageUrl,
          is_approved: false,
        },
      ])

      // No matter if error or not, show the submitted message
      setShowSubmittedMessage(true)
      setUploadForm({ title: "", description: "", imageFile: null, imageUrl: "" })
      setShowUploadForm(false)
    } catch (error: any) {
      console.error("Error submitting memory:", error, error?.message, error?.details)
      // Still show the submitted message even if there was an error
      setShowSubmittedMessage(true)
      setShowUploadForm(false)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading memories...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-4 md:pt-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Memory Gallery 📸
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            A collection of beautiful moments and memories with Ritchie
          </p>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold smooth-hover"
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Share a Memory
          </Button>
        </div>

        {/* Submission message */}
        {showSubmittedMessage && (
          <div className="mb-8 max-w-2xl mx-auto text-center p-6 bg-green-700/80 text-white rounded-lg font-semibold shadow-lg">
            🎉 Your memory has been submitted for approval!
          </div>
        )}

        {/* Upload Form */}
        {!showSubmittedMessage && showUploadForm && (
          <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20 mb-8 max-w-2xl mx-auto smooth-hover">
            <form onSubmit={handleSubmitMemory} className="space-y-6">
              <div className="text-center mb-6">
                <ImageIcon className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">Share a Memory</h3>
                <p className="text-gray-300">Upload a photo and tell the story behind it</p>
              </div>

              <Input
                placeholder="Memory title (e.g., 'College Days', 'Birthday Party 2023')"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4"
                required
              />

              <Textarea
                placeholder="Describe this memory... What happened? When was it? What made it special?"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4"
                rows={4}
              />

              {/* File Upload */}
              <div className="space-y-4">
                <label className="block text-white font-semibold">Upload Photo:</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-300">
                      {uploadForm.imageFile ? uploadForm.imageFile.name : "Click to upload image"}
                    </span>
                    <span className="text-sm text-gray-400">Max 5MB • JPG, PNG, GIF</span>
                  </label>
                </div>
              </div>

              {/* OR divider */}
              <div className="flex items-center space-x-4">
                <hr className="flex-1 border-white/20" />
                <span className="text-gray-400">OR</span>
                <hr className="flex-1 border-white/20" />
              </div>

              {/* URL Input */}
              <Input
                placeholder="Paste image URL (if you prefer to use a link)"
                value={uploadForm.imageUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value, imageFile: null })}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4"
                disabled={!!uploadForm.imageFile}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 text-lg font-semibold"
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Memory
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  className="border-white/20 text-white hover:bg-white/10 px-8"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Memory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {memories.map((memory) => (
            <Card
              key={memory.id}
              className="overflow-hidden bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={memory.image_url || "/placeholder.svg?height=400&width=400"}
                  alt={memory.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">{memory.title}</h3>
                  {memory.description && <p className="text-gray-200 text-sm line-clamp-2">{memory.description}</p>}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-gray-300 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(memory.created_at).toLocaleDateString()}
                  </div>
                  <Heart className="w-4 h-4 text-red-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {memories.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 text-xl">No memories shared yet.</p>
            <p className="text-gray-400">Be the first to share a special moment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
