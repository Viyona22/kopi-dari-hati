
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ShoppingBag, Users, MapPin } from 'lucide-react';

interface ActivityCardProps {
  activity: {
    id: string;
    type: 'pemesanan' | 'reservasi';
    date: string;
    time?: string;
    status: string;
    totalAmount?: number;
    customerName: string;
    details?: any;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selesai':
      case 'dikonfirmasi':
        return 'bg-green-100 text-green-800';
      case 'diproses':
      case 'menunggu':
      case 'dalam proses':
        return 'bg-orange-100 text-orange-800';
      case 'batal':
      case 'dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {activity.type === 'pemesanan' ? (
              <ShoppingBag className="h-6 w-6 text-[#d4462d]" />
            ) : (
              <Users className="h-6 w-6 text-[#d4462d]" />
            )}
            <div>
              <h3 className="font-semibold text-lg capitalize">
                {activity.type}
              </h3>
              <p className="text-sm text-gray-600">
                {activity.customerName}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(activity.status)}>
            {activity.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(activity.date)}</span>
          </div>
          
          {activity.time && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {activity.type === 'pemesanan' 
                  ? `Dipesan pada ${activity.time}` 
                  : activity.time
                }
              </span>
            </div>
          )}
        </div>

        {activity.type === 'pemesanan' && activity.totalAmount && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Pembayaran:
              </span>
              <span className="font-bold text-[#d4462d]">
                {formatCurrency(activity.totalAmount)}
              </span>
            </div>
          </div>
        )}

        {activity.type === 'reservasi' && activity.details && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{activity.details.guests} tamu</span>
              </div>
              {activity.details.special_requests && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="truncate max-w-[200px]">
                    {activity.details.special_requests}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
