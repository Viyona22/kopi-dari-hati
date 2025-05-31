
import { useState, useEffect } from 'react'
import { supabase, Reservation } from '@/lib/supabase'
import { toast } from 'sonner'

export function useReservationData() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  // Load reservations from Supabase
  const loadReservations = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, using empty reservations')
        setReservations([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
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
      if (!supabase) {
        toast.error('Database not configured')
        throw new Error('Supabase not configured')
      }

      const { data, error } = await supabase
        .from('reservations')
        .upsert(reservation)
        .select()

      if (error) throw error
      
      await loadReservations() // Refresh data
      toast.success('Reservasi berhasil disimpan!')
      return data[0]
    } catch (error) {
      console.error('Error saving reservation:', error)
      toast.error('Gagal menyimpan reservasi')
      throw error
    }
  }

  // Update reservation status
  const updateReservationStatus = async (id: string, status: 'Menunggu' | 'Dalam Proses' | 'Selesai' | 'Batal') => {
    try {
      if (!supabase) {
        toast.error('Database not configured')
        throw new Error('Supabase not configured')
      }

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
      if (!supabase) {
        toast.error('Database not configured')
        throw new Error('Supabase not configured')
      }

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
    loadReservations()
  }, [])

  return {
    reservations,
    loading,
    saveReservation,
    updateReservationStatus,
    deleteReservation,
    refreshData: loadReservations
  }
}
