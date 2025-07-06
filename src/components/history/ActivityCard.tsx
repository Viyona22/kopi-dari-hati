
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ShoppingBag, Users, MapPin } from 'lucide-react';
import { PaymentProofUploadModal } from './PaymentProofUploadModal';

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
    payment_status?: string;
    payment_deadline?: string;
  };
  onRefresh?: () => void;
}

export function ActivityCard({ activity, onRefresh }: ActivityCardProps) {
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

  // Check if payment proof upload is needed
  const needsPaymentProof = activity.type === 'pemesanan' && 
    activity.payment_status === 'pending' && 
    activity.status !== 'Selesai' && 
    activity.status !== 'Dibatalkan';

  // Check if payment deadline has passed
  const isPaymentExpired = activity.payment_deadline && 
    new Date(activity.payment_deadline) < new Date();

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
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(activity.status)}>
              {activity.status}
            </Badge>
            {needsPaymentProof && !isPaymentExpired && (
              <PaymentProofUploadModal 
                purchaseId={activity.id}
                onUploadComplete={() => {
                  if (onRefresh) onRefresh();
                }}
              />
            )}
          </div>
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

        {/* Payment Status Info for Orders */}
        {activity.type === 'pemesanan' && activity.payment_status && (
          <div className="mb-4">
            {activity.payment_status === 'pending' && !isPaymentExpired && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Menunggu Pembayaran:</strong> Silakan upload bukti pembayaran untuk melanjutkan pesanan.
                </p>
                {activity.payment_deadline && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Batas waktu: {new Date(activity.payment_deadline).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            )}
            {activity.payment_status === 'uploaded' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Bukti Pembayaran Diunggah:</strong> Menunggu verifikasi admin.
                </p>
              </div>
            )}
            {activity.payment_status === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Pembayaran Terverifikasi:</strong> Pesanan sedang diproses.
                </p>
              </div>
            )}
            {isPaymentExpired && activity.payment_status === 'pending' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Batas Waktu Pembayaran Habis:</strong> Pesanan akan dibatalkan secara otomatis.
                </p>
              </div>
            )}
          </div>
        )}

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
