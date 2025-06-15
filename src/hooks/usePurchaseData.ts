
import { useState, useEffect } from 'react'
import { supabase, Purchase } from '@/lib/supabase'
import { toast } from 'sonner'

export function usePurchaseData() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  // Load purchases from Supabase
  const loadPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setPurchases(data || [])
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
      const { data, error } = await supabase
        .from('purchases')
        .insert(purchase)
        .select()

      if (error) throw error
      
      await loadPurchases() // Refresh data
      toast.success('Pembelian berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving purchase:', error)
      toast.error('Gagal menyimpan pembelian')
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
    loadPurchases()
  }, [])

  return {
    purchases,
    loading,
    savePurchase,
    updatePurchaseStatus,
    deletePurchase,
    refreshData: loadPurchases
  }
}
