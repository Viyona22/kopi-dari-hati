
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Review {
  id: string
  menu_item_id: string
  customer_name: string
  customer_email?: string
  rating: number
  comment?: string
  created_at?: string
  updated_at?: string
}

export function useReviewData(menuItemId?: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  // Load reviews for a specific menu item
  const loadReviews = async (itemId?: string) => {
    if (!itemId) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('menu_item_id', itemId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setReviews(data || [])
      
      // Calculate average rating
      if (data && data.length > 0) {
        const total = data.reduce((sum, review) => sum + review.rating, 0)
        setAverageRating(total / data.length)
        setTotalReviews(data.length)
      } else {
        setAverageRating(0)
        setTotalReviews(0)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      setReviews([])
      setAverageRating(0)
      setTotalReviews(0)
    } finally {
      setLoading(false)
    }
  }

  // Submit a new review
  const submitReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()

      if (error) throw error
      
      await loadReviews(review.menu_item_id) // Refresh reviews
      toast.success('Review berhasil dikirim!')
      return data[0]
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Gagal mengirim review')
      throw error
    }
  }

  useEffect(() => {
    if (menuItemId) {
      loadReviews(menuItemId)
    }
  }, [menuItemId])

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    submitReview,
    refreshReviews: () => loadReviews(menuItemId)
  }
}
