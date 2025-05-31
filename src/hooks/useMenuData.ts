
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
      
      setMenuItems(data || [])
    } catch (error) {
      console.error('Error loading menu items:', error)
      // Fallback to default data if no database entries
      setMenuItems(getDefaultMenuItems())
    } finally {
      setLoading(false)
    }
  }

  // Save menu item to Supabase
  const saveMenuItem = async (item: Omit<MenuItem, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .upsert(item)
        .select()

      if (error) throw error
      
      await loadMenuItems() // Refresh data
      toast.success('Menu berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Gagal menyimpan menu')
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

// Default menu items as fallback
function getDefaultMenuItems(): MenuItem[] {
  return [
    { id: '1', name: 'Ice Kopi Susu', price: 22000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '2', name: 'Ice Matcha Espresso', price: 30000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '3', name: 'Ice Coffee Shake', price: 25000, category: 'kopi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '17', name: 'Original Beef Bowl', price: 40000, category: 'makanan', description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' },
    { id: '11', name: 'Pisang Coklat', price: 10000, category: 'cemilan', image: '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png' }
  ]
}
