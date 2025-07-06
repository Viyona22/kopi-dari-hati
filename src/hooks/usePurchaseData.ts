
import { useState, useEffect } from 'react'
import { supabase, Purchase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuthContext } from '@/components/auth/AuthProvider'
import { PaymentMethod, validatePaymentMethod } from '@/components/payment/PaymentConstants'

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

      console.log('=== SAVE PURCHASE DEBUG ===');
      console.log('Input purchase data:', purchase);
      console.log('Payment method to validate:', purchase.payment_method);

      // Validate payment method before saving using database constraint validation
      const paymentMethod = purchase.payment_method;
      
      if (!validatePaymentMethod(paymentMethod)) {
        console.error('=== PAYMENT METHOD VALIDATION FAILED ===');
        console.error('Invalid payment method:', paymentMethod);
        console.error('Expected one of: qris, bank_transfer, ewallet');
        throw new Error(`Metode pembayaran tidak valid. Pilihan yang tersedia: qris, bank_transfer, ewallet`);
      }

      console.log('✅ Payment method validation passed for:', paymentMethod);

      // Add user_id to purchase data
      const purchaseData = {
        ...purchase,
        user_id: user.id,
        payment_method: paymentMethod as PaymentMethod
      }

      console.log('Final purchase data to save:', purchaseData);

      const { data, error } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select()

      if (error) {
        console.error('=== DATABASE ERROR ===');
        console.error('Database error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === '23514') {
          // Check constraint violation - payment method issue
          throw new Error('Metode pembayaran tidak valid. Silakan pilih metode yang tersedia.');
        }
        throw error;
      }
      
      console.log('✅ Purchase saved successfully:', data);
      await loadPurchases() // Refresh data
      toast.success('Pembelian berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('=== SAVE PURCHASE ERROR ===');
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
      // Validate payment method
      if (!validatePaymentMethod(paymentMethod)) {
        throw new Error('Metode pembayaran tidak valid');
      }

      const { error } = await supabase
        .from('purchases')
        .update({ 
          payment_method: paymentMethod as PaymentMethod,
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
    refreshData: loadPurchases
  }
}
