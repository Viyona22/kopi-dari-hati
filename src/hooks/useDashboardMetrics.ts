
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
        // Use the new materialized view for better performance
        const { data: dashboardData } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .single();

        if (dashboardData) {
          setMetrics({
            totalRevenue: dashboardData.today_revenue || 0,
            totalOrders: dashboardData.today_orders || 0,
            totalReservations: 0, // Will calculate separately
            totalCustomers: 0, // Will calculate separately
            revenueGrowth: 0, // Placeholder for now
            ordersGrowth: 0, // Placeholder for now
            reservationsGrowth: 0,
            customersGrowth: 0,
          });
        }

        // Get reservations count for today using optimized query
        const { count: todayReservations } = await supabase
          .from('reservations')
          .select('*', { count: 'exact' })
          .eq('date', new Date().toISOString().split('T')[0]);

        // Get unique customers count by counting distinct customer_phone from purchases
        const { data: uniqueCustomersData } = await supabase
          .from('purchases')
          .select('customer_phone')
          .not('customer_phone', 'is', null);

        const uniqueCustomersCount = uniqueCustomersData 
          ? new Set(uniqueCustomersData.map(p => p.customer_phone)).size 
          : 0;

        setMetrics(prev => ({
          ...prev,
          totalReservations: todayReservations || 0,
          totalCustomers: uniqueCustomersCount,
        }));

        // Refresh materialized view periodically
        await supabase.rpc('refresh_dashboard_metrics');

      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh metrics every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading };
}
