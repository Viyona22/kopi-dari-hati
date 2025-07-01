
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
      console.log('=== MENU SAVE DEBUG ===')
      console.log('1. Item to save:', item)
      
      // Validate required fields
      if (!item.name?.trim()) {
        console.error('Validation failed: Name is required')
        toast.error('Nama menu wajib diisi')
        throw new Error('Name is required')
      }
      
      if (!item.price || item.price <= 0) {
        console.error('Validation failed: Price must be greater than 0')
        toast.error('Harga menu harus lebih dari 0')
        throw new Error('Price must be greater than 0')
      }
      
      if (!item.category?.trim()) {
        console.error('Validation failed: Category is required')
        toast.error('Kategori menu wajib dipilih')
        throw new Error('Category is required')
      }

      console.log('2. Basic validation passed')

      // Check if category exists in categories table
      console.log('3. Checking if category exists:', item.category)
      const { data: categoryCheck, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, display_name')
        .eq('id', item.category)
        .single()

      if (categoryError) {
        console.error('Category check error:', categoryError)
        toast.error('Kategori yang dipilih tidak valid atau tidak ditemukan.')
        throw new Error(`Category validation failed: ${categoryError.message}`)
      }

      if (!categoryCheck) {
        console.error('Category not found in database:', item.category)
        toast.error('Kategori yang dipilih tidak ditemukan di database.')
        throw new Error('Category not found')
      }

      console.log('4. Category validation passed:', categoryCheck)
      
      // For new items, check if ID already exists to avoid conflicts
      if (item.id) {
        const { data: existingItem } = await supabase
          .from('menu_items')
          .select('id')
          .eq('id', item.id)
          .single()
        
        if (existingItem) {
          console.log('Item with this ID already exists, updating instead of inserting')
        }
      }
      
      // Prepare the item for database insertion - remove undefined values
      const itemToSave = {
        ...(item.id && { id: item.id }),
        name: item.name.trim(),
        price: Number(item.price),
        category: item.category,
        description: item.description?.trim() || null,
        image: item.image || null,
        badge_type: item.badge_type || null,
        stock_quantity: Number(item.stock_quantity) || 50,
        is_featured: Boolean(item.is_featured) || false,
        sort_order: Number(item.sort_order) || 0
      }

      console.log('5. Prepared item for database:', itemToSave)

      // Use insert for new items or upsert for existing items
      let query;
      if (item.id) {
        // Use upsert for items with existing ID
        query = supabase
          .from('menu_items')
          .upsert(itemToSave, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
      } else {
        // Use insert for new items without ID (let database generate it)
        const { id, ...itemWithoutId } = itemToSave
        query = supabase
          .from('menu_items')
          .insert(itemWithoutId)
          .select()
      }

      const { data, error } = await query

      if (error) {
        console.error('Database save error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // More specific error messages based on error type
        if (error.message?.includes('violates check constraint')) {
          toast.error('Data menu tidak valid. Periksa kategori yang dipilih.')
        } else if (error.message?.includes('foreign key')) {
          toast.error('Kategori yang dipilih tidak valid atau tidak ditemukan.')
        } else if (error.message?.includes('duplicate key')) {
          toast.error('Menu dengan ID tersebut sudah ada.')
        } else if (error.message?.includes('null value')) {
          toast.error('Semua field wajib harus diisi.')
        } else {
          toast.error(`Gagal menyimpan menu: ${error.message}`)
        }
        throw error
      }
      
      console.log('6. Successfully saved to database:', data)
      await loadMenuItems() // Refresh data
      toast.success('Menu berhasil disimpan!')
      return data?.[0]
    } catch (error) {
      console.error('=== SAVE MENU ERROR ===', error)
      
      // If we haven't shown a toast error yet, show a generic one
      if (!error.message?.includes('Name is required') && 
          !error.message?.includes('Price must be greater than 0') &&
          !error.message?.includes('Category is required') &&
          !error.message?.includes('Category validation failed') &&
          !error.message?.includes('Category not found')) {
        toast.error('Gagal menambahkan menu. Silakan coba lagi.')
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
