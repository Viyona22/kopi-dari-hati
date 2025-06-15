
import { supabase } from '@/integrations/supabase/client'

// Re-export the supabase client
export { supabase }

// Database types - updated to match actual database schema
export interface MenuItem {
  id: string
  name: string
  price: number
  category: string // Changed from union type to string to match database
  description?: string
  image: string | null // Changed to match database schema
  created_at?: string
  updated_at?: string
}

export interface Reservation {
  id: string
  name: string
  date: string
  guests: number
  time: string
  status: string // Changed from union type to string to match database
  created_at?: string
}

export interface Purchase {
  id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  order_items: any[] // Array of order items with details
  total_amount: number // Total in rupiah
  payment_method: string
  status: string
  created_at?: string
}

export interface Category {
  id: string
  name: string
  display_name: string
  created_at?: string
  updated_at?: string
}
