
import { useState, useEffect } from 'react'
import { supabase, Reservation } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuthContext } from '@/components/auth/AuthProvider'

export function useReservationData() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuthContext()

  // Load reservations from Supabase
  const loadReservations = async () => {
    try {
      console.log('Loading reservations for user:', user?.id, 'role:', userProfile?.role);
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      console.log('Loaded reservations:', data?.length || 0);
      setReservations(data || [])
    } catch (error) {
      console.error('Error loading reservations:', error)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Save reservation to Supabase
  const saveReservation = async (reservation: Omit<Reservation, 'created_at'>) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Add user_id to reservation data
      const reservationData = {
        ...reservation,
        user_id: user.id
      }

      console.log('Saving reservation with user_id:', reservationData);

      const { data, error } = await supabase
        .from('reservations')
        .upsert(reservationData)
        .select()

      if (error) throw error
      
      await loadReservations() // Refresh data
      toast.success('Reservasi berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving reservation:', error)
      toast.error('Gagal menyimpan reservasi. Pastikan Anda sudah login.')
      throw error
    }
  }

  // Update reservation status
  const updateReservationStatus = async (id: string, status: 'Menunggu' | 'Dalam Proses' | 'Selesai' | 'Batal') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      await loadReservations() // Refresh data
      toast.success('Status reservasi berhasil diupdate!')
    } catch (error) {
      console.error('Error updating reservation status:', error)
      toast.error('Gagal mengupdate status reservasi')
      throw error
    }
  }

  // Delete reservation
  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await loadReservations() // Refresh data
      toast.success('Reservasi berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting reservation:', error)
      toast.error('Gagal menghapus reservasi')
      throw error
    }
  }

  useEffect(() => {
    if (user && userProfile) {
      loadReservations()
    }
  }, [user, userProfile])

  return {
    reservations,
    loading,
    saveReservation,
    updateReservationStatus,
    deleteReservation,
    refreshData: loadReservations
  }
}
