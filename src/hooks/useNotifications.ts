
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  type: 'order' | 'reservation' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      // Simulate notifications from recent activities
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get recent purchases
      const { data: recentPurchases } = await supabase
        .from('purchases')
        .select('*')
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent reservations
      const { data: recentReservations } = await supabase
        .from('reservations')
        .select('*')
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      const mockNotifications: Notification[] = [
        ...((recentPurchases || []).map(purchase => ({
          id: `purchase-${purchase.id}`,
          type: 'order' as const,
          title: 'Pesanan Baru',
          message: `Pesanan dari ${purchase.customer_name} senilai ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(purchase.total_amount)}`,
          read: false,
          created_at: purchase.created_at,
          data: purchase
        }))),
        ...((recentReservations || []).map(reservation => ({
          id: `reservation-${reservation.id}`,
          type: 'reservation' as const,
          title: 'Reservasi Baru',
          message: `Reservasi dari ${reservation.name} untuk ${reservation.guests} orang pada ${reservation.date}`,
          read: false,
          created_at: reservation.created_at,
          data: reservation
        })))
      ];

      // Sort by created_at
      mockNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: loadNotifications
  };
}
