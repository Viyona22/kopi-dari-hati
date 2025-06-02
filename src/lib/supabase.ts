
import { supabase } from '@/integrations/supabase/client'

// Re-export the supabase client
export { supabase }

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
