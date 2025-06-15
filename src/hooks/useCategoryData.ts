
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Category {
  id: string
  name: string
  display_name: string
  created_at?: string
  updated_at?: string
}

export function useCategoryData() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Load categories from Supabase
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Save category to Supabase
  const saveCategory = async (category: Omit<Category, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .upsert(category)
        .select()

      if (error) throw error
      
      await loadCategories() // Refresh data
      toast.success('Kategori berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Gagal menyimpan kategori')
      throw error
    }
  }

  // Delete category from Supabase
  const deleteCategory = async (id: string) => {
    try {
      // Check if category has menu items
      const { data: menuItems, error: checkError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('category', id)
        .limit(1)

      if (checkError) throw checkError

      if (menuItems && menuItems.length > 0) {
        toast.error('Tidak dapat menghapus kategori yang masih memiliki menu')
        return
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await loadCategories() // Refresh data
      toast.success('Kategori berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Gagal menghapus kategori')
      throw error
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return {
    categories,
    loading,
    saveCategory,
    deleteCategory,
    refreshData: loadCategories
  }
}
