
import { supabase } from '@/integrations/supabase/client'

// Re-export the supabase client
export { supabase }

// Database types - updated to match actual database schema
export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description?: string
  image: string | null
  badge_type?: 'terlaris' | 'baru' | null
  stock_quantity?: number
  is_featured?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface Reservation {
  id: string
  name: string
  date: string
  guests: number
  time: string
  status: string
  phone?: string
  email?: string
  special_requests?: string
  created_at?: string
}

export interface Purchase {
  id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  order_items: any[]
  total_amount: number
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

export interface Favorite {
  id: string
  customer_email: string
  menu_item_id: string
  created_at?: string
}

export interface MenuAnalytics {
  id: string
  menu_item_id: string
  total_favorites: number
  total_orders: number
  average_rating: number
  total_reviews: number
  last_updated?: string
}
