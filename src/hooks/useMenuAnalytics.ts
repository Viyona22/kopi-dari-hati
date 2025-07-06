
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

  // Load all menu analytics using optimized query
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

  // Get analytics for specific menu item using database function
  const getMenuAnalytics = async (menuItemId: string): Promise<MenuAnalytics | null> => {
    try {
      // Use the optimized database function
      const { data, error } = await supabase
        .rpc('calculate_menu_analytics', { item_id: menuItemId })

      if (error) throw error

      if (data && data.length > 0) {
        const analyticsData = data[0];
        
        // Update or insert into menu_analytics table
        const { data: upsertData, error: upsertError } = await supabase
          .from('menu_analytics')
          .upsert({
            menu_item_id: menuItemId,
            total_favorites: analyticsData.total_favorites,
            total_orders: analyticsData.total_orders,
            average_rating: analyticsData.average_rating,
            total_reviews: analyticsData.total_reviews,
            last_updated: new Date().toISOString()
          })
          .select()
          .single()

        if (upsertError) throw upsertError
        return upsertData
      }

      return null
    } catch (error) {
      console.error('Error getting menu analytics:', error)
      return null
    }
  }

  // Update total orders manually (for integration with purchase system)
  const updateOrderCount = async (menuItemId: string, increment: number = 1) => {
    try {
      // Trigger analytics update using the database trigger
      // This will be handled automatically by the trigger function
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
