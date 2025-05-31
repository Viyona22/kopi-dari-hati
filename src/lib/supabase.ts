
import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if both values are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface MenuItem {
  id: string
  name: string
  price: number
  category: 'kopi' | 'cemilan' | 'makanan'
  description?: string
  image: string
  created_at?: string
  updated_at?: string
}

export interface Reservation {
  id: string
  name: string
  date: string
  guests: number
  time: string
  status: 'Menunggu' | 'Dalam Proses' | 'Selesai' | 'Batal'
  created_at?: string
}

export interface Purchase {
  id: string
  date: string
  product: string
  total: string
  status: 'Diproses' | 'Selesai' | 'Dibatalkan'
  created_at?: string
}
