
import { useState, useEffect } from 'react'
import { supabase, Purchase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuthContext } from '@/components/auth/AuthProvider'

export function usePurchaseData() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuthContext()

  // Load purchases from Supabase
  const loadPurchases = async () => {
    try {
      console.log('Loading purchases for user:', user?.id, 'role:', userProfile?.role);
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to match our Purchase interface
      const transformedData = data?.map(purchase => ({
        ...purchase,
        order_items: Array.isArray(purchase.order_items) 
          ? purchase.order_items 
          : JSON.parse(purchase.order_items as string)
      })) || []
      
      console.log('Loaded purchases:', transformedData.length);
      setPurchases(transformedData)
    } catch (error) {
      console.error('Error loading purchases:', error)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  // Save purchase to Supabase
  const savePurchase = async (purchase: Omit<Purchase, 'id' | 'created_at'>) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Add user_id to purchase data
      const purchaseData = {
        ...purchase,
        user_id: user.id
      }

      console.log('Saving purchase with user_id:', purchaseData);

      const { data, error } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select()

      if (error) throw error
      
      await loadPurchases() // Refresh data
      toast.success('Pembelian berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving purchase:', error)
      toast.error('Gagal menyimpan pembelian. Pastikan Anda sudah login.')
      throw error
    }
  }

  // Update purchase status
  const updatePurchaseStatus = async (id: string, status: 'Diproses' | 'Selesai' | 'Dibatalkan') => {
    try {
      const { error } = await supabase
        .from('purchases')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      await loadPurchases() // Refresh data
      toast.success('Status pembelian berhasil diupdate!')
    } catch (error) {
      console.error('Error updating purchase status:', error)
      toast.error('Gagal mengupdate status pembelian')
      throw error
    }
  }

  // Delete purchase
  const deletePurchase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await loadPurchases() // Refresh data
      toast.success('Pembelian berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting purchase:', error)
      toast.error('Gagal menghapus pembelian')
      throw error
    }
  }

  useEffect(() => {
    if (user && userProfile) {
      loadPurchases()
    }
  }, [user, userProfile])

  return {
    purchases,
    loading,
    savePurchase,
    updatePurchaseStatus,
    deletePurchase,
    refreshData: loadPurchases
  }
}
