"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Wish {
  id: string
  name: string
  message: string
  created_at: string
  is_public: boolean
}

export interface Memory {
  id: string
  title: string
  description: string | null
  image_url: string
  created_at: string
  is_approved: boolean
}

export interface Gift {
  id: string
  name: string
  email: string
  amount: number | null
  message: string | null
  payment_method: string | null
  created_at: string
  contact_requested: boolean
}
