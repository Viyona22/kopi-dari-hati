
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface MenuAnalytics {
  id: string
  menu_item_id: string
  total_favorites: number
  total_orders: number
  average_rating: number
  total_reviews: number
  last_updated?: string
}

export function useMenuAnalytics() {
  const [analytics, setAnalytics] = useState<MenuAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  // Load all menu analytics
  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_analytics')
        .select('*')
        .order('total_favorites', { ascending: false })

      if (error) throw error
      
      setAnalytics(data || [])
    } catch (error) {
      console.error('Error loading menu analytics:', error)
      setAnalytics([])
    } finally {
      setLoading(false)
    }
  }

  // Get analytics for specific menu item
  const getMenuAnalytics = async (menuItemId: string): Promise<MenuAnalytics | null> => {
    try {
      const { data, error } = await supabase
        .from('menu_analytics')
        .select('*')
        .eq('menu_item_id', menuItemId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create new analytics entry
          const newAnalytics = {
            menu_item_id: menuItemId,
            total_favorites: 0,
            total_orders: 0,
            average_rating: 0,
            total_reviews: 0
          }
          
          const { data: insertedData, error: insertError } = await supabase
            .from('menu_analytics')
            .insert(newAnalytics)
            .select()
            .single()

          if (insertError) throw insertError
          return insertedData
        }
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error getting menu analytics:', error)
      return null
    }
  }

  // Update total orders manually (for integration with purchase system)
  const updateOrderCount = async (menuItemId: string, increment: number = 1) => {
    try {
      // First get current count
      const { data: currentData } = await supabase
        .from('menu_analytics')
        .select('total_orders')
        .eq('menu_item_id', menuItemId)
        .single()

      const currentCount = currentData?.total_orders || 0
      
      const { error } = await supabase
        .from('menu_analytics')
        .update({
          total_orders: currentCount + increment,
          last_updated: new Date().toISOString()
        })
        .eq('menu_item_id', menuItemId)

      if (error) throw error
      await loadAnalytics()
    } catch (error) {
      console.error('Error updating order count:', error)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return {
    analytics,
    loading,
    getMenuAnalytics,
    updateOrderCount,
    refreshAnalytics: loadAnalytics
  }
}
