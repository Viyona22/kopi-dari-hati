
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalReservations: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  reservationsGrowth: number;
  customersGrowth: number;
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalReservations: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    reservationsGrowth: 0,
    customersGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get current month data
        const currentMonth = new Date();
        const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        // Get previous month data for comparison
        const firstDayPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const lastDayPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

        // Fetch purchases data
        const { data: currentPurchases } = await supabase
          .from('purchases')
          .select('total_amount, created_at')
          .gte('created_at', firstDayCurrentMonth.toISOString())
          .lte('created_at', lastDayCurrentMonth.toISOString());

        const { data: prevPurchases } = await supabase
          .from('purchases')
          .select('total_amount')
          .gte('created_at', firstDayPrevMonth.toISOString())
          .lte('created_at', lastDayPrevMonth.toISOString());

        // Fetch reservations data
        const { data: currentReservations } = await supabase
          .from('reservations')
          .select('created_at')
          .gte('created_at', firstDayCurrentMonth.toISOString())
          .lte('created_at', lastDayCurrentMonth.toISOString());

        const { data: prevReservations } = await supabase
          .from('reservations')
          .select('created_at')
          .gte('created_at', firstDayPrevMonth.toISOString())
          .lte('created_at', lastDayPrevMonth.toISOString());

        // Fetch total customers (unique user_ids in purchases and reservations)
        const { data: allPurchases } = await supabase
          .from('purchases')
          .select('user_id')
          .not('user_id', 'is', null);

        const { data: allReservations } = await supabase
          .from('reservations')
          .select('user_id')
          .not('user_id', 'is', null);

        // Calculate current metrics
        const totalRevenue = currentPurchases?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0;
        const totalOrders = currentPurchases?.length || 0;
        const totalReservations = currentReservations?.length || 0;
        
        // Calculate unique customers
        const uniqueCustomerIds = new Set([
          ...(allPurchases?.map(p => p.user_id) || []),
          ...(allReservations?.map(r => r.user_id) || [])
        ]);
        const totalCustomers = uniqueCustomerIds.size;

        // Calculate previous metrics for growth
        const prevRevenue = prevPurchases?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0;
        const prevOrders = prevPurchases?.length || 0;
        const prevReservationsCount = prevReservations?.length || 0;

        // Calculate growth percentages
        const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const ordersGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
        const reservationsGrowth = prevReservationsCount > 0 ? ((totalReservations - prevReservationsCount) / prevReservationsCount) * 100 : 0;

        setMetrics({
          totalRevenue,
          totalOrders,
          totalReservations,
          totalCustomers,
          revenueGrowth,
          ordersGrowth,
          reservationsGrowth,
          customersGrowth: 0, // Would need historical customer data to calculate this
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading };
}
