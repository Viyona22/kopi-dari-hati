import { useState, useEffect } from 'react'
import { supabase, Purchase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { VALID_PAYMENT_METHODS } from '@/components/payment/PaymentConstants'

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

      // Validate payment method before saving using constants
      if (!VALID_PAYMENT_METHODS.includes(purchase.payment_method)) {
        console.error('Invalid payment method:', purchase.payment_method);
        console.error('Valid methods:', VALID_PAYMENT_METHODS);
        throw new Error('Metode pembayaran tidak valid');
      }

      // Add user_id to purchase data
      const purchaseData = {
        ...purchase,
        user_id: user.id
      }

      console.log('Saving purchase with validated data:', purchaseData);

      const { data, error } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select()

      if (error) {
        console.error('Database error details:', error);
        if (error.code === '23514') {
          throw new Error('Metode pembayaran tidak valid. Silakan pilih metode yang tersedia.');
        }
        throw error;
      }
      
      await loadPurchases() // Refresh data
      toast.success('Pembelian berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving purchase:', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan pembelian';
      toast.error(errorMessage)
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

  // Update payment method
  const updatePaymentMethod = async (id: string, paymentMethod: string) => {
    try {
      const { error } = await supabase
        .from('purchases')
        .update({ 
          payment_method: paymentMethod,
          payment_proof_id: null // Reset proof if payment method changes
        })
        .eq('id', id)

      if (error) throw error
      
      await loadPurchases() // Refresh data
      toast.success('Metode pembayaran berhasil diubah!')
      return true
    } catch (error) {
      console.error('Error updating payment method:', error)
      toast.error('Gagal mengubah metode pembayaran')
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
    updatePaymentMethod,
    deletePurchase,
    refreshData: loadPurchases
  }
}
