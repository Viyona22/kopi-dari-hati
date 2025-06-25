
import { useState, useEffect } from 'react'
import { supabase, MenuItem } from '@/lib/supabase'
import { toast } from 'sonner'

export function useMenuData() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load menu items from Supabase
  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Cast the data to MenuItem[] to handle the badge_type typing
      const typedData = (data || []).map(item => ({
        ...item,
        badge_type: item.badge_type as 'terlaris' | 'baru' | null
      })) as MenuItem[]
      
      setMenuItems(typedData)
    } catch (error) {
      console.error('Error loading menu items:', error)
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  // Save menu item to Supabase
  const saveMenuItem = async (item: MenuItem | Omit<MenuItem, 'created_at' | 'updated_at'>) => {
    try {
      console.log('Attempting to save menu item:', item)
      
      // Prepare the item for database insertion
      const itemToSave = {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        description: item.description || null,
        image: item.image || null,
        badge_type: item.badge_type || null,
        stock_quantity: Number(item.stock_quantity) || 50,
        is_featured: Boolean(item.is_featured) || false,
        sort_order: Number(item.sort_order) || 0
      }

      console.log('Prepared item for database:', itemToSave)

      const { data, error } = await supabase
        .from('menu_items')
        .upsert(itemToSave, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()

      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      console.log('Successfully saved to database:', data)
      await loadMenuItems() // Refresh data
      toast.success('Menu berhasil disimpan!')
      return data?.[0]
    } catch (error) {
      console.error('Error saving menu item:', error)
      
      // More specific error messages
      if (error.message?.includes('violates check constraint')) {
        toast.error('Data menu tidak valid. Periksa kategori yang dipilih.')
      } else if (error.message?.includes('foreign key')) {
        toast.error('Kategori yang dipilih tidak valid atau tidak ditemukan.')
      } else if (error.message?.includes('duplicate key')) {
        toast.error('Menu dengan ID tersebut sudah ada.')
      } else {
        toast.error(`Gagal menyimpan menu: ${error.message}`)
      }
      throw error
    }
  }

  // Delete menu item from Supabase
  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await loadMenuItems() // Refresh data
      toast.success('Menu berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Gagal menghapus menu')
      throw error
    }
  }

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `menu-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Gagal mengupload gambar')
      throw error
    }
  }

  useEffect(() => {
    loadMenuItems()
  }, [])

  return {
    menuItems,
    loading,
    saveMenuItem,
    deleteMenuItem,
    uploadImage,
    refreshData: loadMenuItems
  }
}
