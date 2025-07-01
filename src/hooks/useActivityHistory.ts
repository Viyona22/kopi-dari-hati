
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface Activity {
  id: string;
  type: 'pemesanan' | 'reservasi';
  date: string;
  time?: string;
  status: string;
  totalAmount?: number;
  customerName: string;
  details?: any;
  created_at: string;
}

export function useActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuthContext();

  const loadActivities = async () => {
    if (!user || !userProfile) {
      console.log('No user or profile, clearing activities');
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading activities for user:', user.id, 'role:', userProfile.role);

      // Load purchases (pemesanan) - RLS will filter automatically based on role
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (purchasesError) {
        console.error('Error loading purchases:', purchasesError);
        throw purchasesError;
      }

      // Load reservations - RLS will filter automatically based on role
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (reservationsError) {
        console.error('Error loading reservations:', reservationsError);
        throw reservationsError;
      }

      console.log('Raw data loaded - Purchases:', purchases?.length || 0, 'Reservations:', reservations?.length || 0);

      // Transform purchases to activities
      const purchaseActivities: Activity[] = (purchases || []).map(purchase => ({
        id: purchase.id,
        type: 'pemesanan' as const,
        date: purchase.created_at || new Date().toISOString(),
        status: purchase.status,
        totalAmount: purchase.total_amount,
        customerName: purchase.customer_name,
        details: {
          phone: purchase.customer_phone,
          address: purchase.customer_address,
          paymentMethod: purchase.payment_method,
          orderItems: purchase.order_items
        },
        created_at: purchase.created_at || new Date().toISOString()
      }));

      // Transform reservations to activities
      const reservationActivities: Activity[] = (reservations || []).map(reservation => ({
        id: reservation.id,
        type: 'reservasi' as const,
        date: reservation.date,
        time: reservation.time,
        status: reservation.status,
        customerName: reservation.name,
        details: {
          guests: reservation.guests,
          phone: reservation.phone,
          email: reservation.email,
          special_requests: reservation.special_requests
        },
        created_at: reservation.created_at || new Date().toISOString()
      }));

      // Combine and sort by creation date
      const allActivities = [...purchaseActivities, ...reservationActivities];
      allActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('Final activities count:', allActivities.length);
      console.log('User role:', userProfile.role, 'Activities for:', userProfile.role === 'admin' ? 'all users' : 'current user only');
      
      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [user, userProfile]);

  return {
    activities,
    loading,
    refreshActivities: loadActivities
  };
}
