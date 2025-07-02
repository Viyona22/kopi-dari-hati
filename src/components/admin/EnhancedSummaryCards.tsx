
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Calendar, Users } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

export function EnhancedSummaryCards() {
  const { metrics, loading } = useDashboardMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{growth.toFixed(1)}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      growth: metrics.revenueGrowth,
      icon: DollarSign,
      description: 'Revenue bulan ini',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toString(),
      growth: metrics.ordersGrowth,
      icon: ShoppingBag,
      description: 'Pesanan bulan ini',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Reservations',
      value: metrics.totalReservations.toString(),
      growth: metrics.reservationsGrowth,
      icon: Calendar,
      description: 'Reservasi bulan ini',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Customers',
      value: metrics.totalCustomers.toString(),
      growth: metrics.customersGrowth,
      icon: Users,
      description: 'Customer terdaftar',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className={`absolute inset-0 ${card.bgColor} opacity-50`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor} ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-600">
                    {card.description}
                  </p>
                  {card.growth !== 0 && (
                    <Badge variant="outline" className="border-none bg-white/80 px-2 py-0">
                      {formatGrowth(card.growth)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
