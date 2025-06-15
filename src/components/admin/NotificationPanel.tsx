
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePurchaseData } from '@/hooks/usePurchaseData';

export function NotificationPanel() {
  const { purchases, updatePurchaseStatus } = usePurchaseData();

  const getNotifications = () => {
    if (!purchases.length) return [];

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return purchases
      .filter(purchase => {
        if (!purchase.created_at) return false;
        const purchaseDate = new Date(purchase.created_at);
        return purchaseDate >= oneDayAgo;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5); // Show latest 5 notifications
  };

  const notifications = getNotifications();

  const getNotificationIcon = (status: string) => {
    switch (status) {
      case 'Diproses':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'Selesai':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Dibatalkan':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Diproses':
        return 'bg-orange-100 text-orange-800';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else {
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleQuickAction = async (purchaseId: string, newStatus: 'Diproses' | 'Selesai' | 'Dibatalkan') => {
    try {
      await updatePurchaseStatus(purchaseId, newStatus);
    } catch (error) {
      console.error('Error updating purchase status:', error);
    }
  };

  const newOrdersCount = purchases.filter(p => 
    p.status === 'Diproses' && 
    p.created_at && 
    new Date(p.created_at) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifikasi Penting
          </CardTitle>
          {newOrdersCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {newOrdersCount} pesanan baru
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Tidak ada notifikasi baru</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(purchase.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        Pesanan dari {purchase.customer_name}
                      </p>
                      <Badge className={getStatusColor(purchase.status)}>
                        {purchase.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {formatCurrency(purchase.total_amount)} • {purchase.created_at && formatTime(purchase.created_at)}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {purchase.order_items.length} item • {purchase.payment_method.toUpperCase()}
                    </p>
                    
                    {purchase.status === 'Diproses' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleQuickAction(purchase.id, 'Selesai')}
                        >
                          Selesai
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="text-xs"
                          onClick={() => handleQuickAction(purchase.id, 'Dibatalkan')}
                        >
                          Batalkan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
