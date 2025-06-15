
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Calendar, Users, DollarSign } from 'lucide-react';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import { useReservationData } from '@/hooks/useReservationData';

export function SummaryCards() {
  const { purchases } = usePurchaseData();
  const { reservations } = useReservationData();

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate today's purchases
  const todayPurchases = purchases.filter(purchase => {
    if (!purchase.created_at) return false;
    const purchaseDate = new Date(purchase.created_at);
    return purchaseDate >= todayStart;
  });

  // Calculate today's reservations
  const todayReservations = reservations.filter(reservation => {
    if (!reservation.created_at) return false;
    const reservationDate = new Date(reservation.created_at);
    return reservationDate >= todayStart;
  });

  // Calculate unique customers this month
  const monthlyCustomers = new Set(
    purchases
      .filter(purchase => {
        if (!purchase.created_at) return false;
        const purchaseDate = new Date(purchase.created_at);
        return purchaseDate >= monthStart;
      })
      .map(purchase => purchase.customer_phone)
  ).size;

  // Calculate monthly revenue
  const monthlyRevenue = purchases
    .filter(purchase => {
      if (!purchase.created_at || purchase.status !== 'Selesai') return false;
      const purchaseDate = new Date(purchase.created_at);
      return purchaseDate >= monthStart;
    })
    .reduce((total, purchase) => total + purchase.total_amount, 0);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pembelian</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayPurchases.length}</div>
          <p className="text-xs text-muted-foreground">Hari ini</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reservasi</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayReservations.length}</div>
          <p className="text-xs text-muted-foreground">Hari ini</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyCustomers}</div>
          <p className="text-xs text-muted-foreground">Bulan ini</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
          <p className="text-xs text-muted-foreground">Bulan ini</p>
        </CardContent>
      </Card>
    </div>
  );
}
