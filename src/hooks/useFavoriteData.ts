
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Favorite {
  id: string
  customer_email: string
  menu_item_id: string
  created_at?: string
}

export function useFavoriteData(customerEmail?: string) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteMenuIds, setFavoriteMenuIds] = useState<Set<string>>(new Set())

  // Load favorites for a customer
  const loadFavorites = async (email?: string) => {
    if (!email) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setFavorites(data || [])
      setFavoriteMenuIds(new Set(data?.map(f => f.menu_item_id) || []))
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavorites([])
      setFavoriteMenuIds(new Set())
    } finally {
      setLoading(false)
    }
  }

  // Add to favorites
  const addToFavorites = async (menuItemId: string, customerEmail: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          menu_item_id: menuItemId,
          customer_email: customerEmail
        })

      if (error) throw error
      
      await loadFavorites(customerEmail)
      toast.success('Ditambahkan ke favorit!')
    } catch (error: any) {
      console.error('Error adding to favorites:', error)
      if (error.code === '23505') {
        toast.error('Menu sudah ada di favorit')
      } else {
        toast.error('Gagal menambahkan ke favorit')
      }
    }
  }

  // Remove from favorites
  const removeFromFavorites = async (menuItemId: string, customerEmail: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('menu_item_id', menuItemId)
        .eq('customer_email', customerEmail)

      if (error) throw error
      
      await loadFavorites(customerEmail)
      toast.success('Dihapus dari favorit!')
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Gagal menghapus dari favorit')
    }
  }

  // Check if menu is favorited
  const isFavorited = (menuItemId: string) => {
    return favoriteMenuIds.has(menuItemId)
  }

  // Get total favorites for a menu item
  const getFavoriteCount = async (menuItemId: string) => {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact' })
        .eq('menu_item_id', menuItemId)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting favorite count:', error)
      return 0
    }
  }

  useEffect(() => {
    if (customerEmail) {
      loadFavorites(customerEmail)
    }
  }, [customerEmail])

  return {
    favorites,
    loading,
    favoriteMenuIds,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    getFavoriteCount,
    refreshFavorites: () => loadFavorites(customerEmail)
  }
}
