
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ActivityCard } from '@/components/history/ActivityCard';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HistoryContent() {
  const { activities, loading, refreshActivities } = useActivityHistory();
  const { userProfile } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pemesanan' | 'reservasi'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' ? true : activity.type === filterType;
    
    const matchesStatus = filterStatus === 'all' ? true : 
                         activity.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(activities.map(a => a.status)));

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4462d] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat riwayat aktivitas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Riwayat Aktivitas
            </h1>
            <p className="text-gray-600">
              {userProfile?.role === 'admin' 
                ? 'Pantau semua aktivitas pelanggan' 
                : 'Pantau semua aktivitas Anda dalam satu tempat'
              }
            </p>
            {userProfile && (
              <p className="text-sm text-[#d4462d] mt-2">
                Selamat datang, {userProfile.full_name} ({userProfile.role})
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari nama atau status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="pemesanan">Pemesanan</SelectItem>
                  <SelectItem value="reservasi">Reservasi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={refreshActivities}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada aktivitas
                </h3>
                <p className="text-gray-600">
                  {activities.length === 0 
                    ? "Belum ada pemesanan atau reservasi yang dibuat."
                    : "Tidak ada aktivitas yang sesuai dengan filter yang dipilih."
                  }
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <ActivityCard key={`${activity.type}-${activity.id}`} activity={activity} />
              ))
            )}
          </div>

          {/* Summary */}
          {activities.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Aktivitas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4462d]">
                    {activities.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Aktivitas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4462d]">
                    {activities.filter(a => a.type === 'pemesanan').length}
                  </div>
                  <div className="text-sm text-gray-600">Pemesanan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4462d]">
                    {activities.filter(a => a.type === 'reservasi').length}
                  </div>
                  <div className="text-sm text-gray-600">Reservasi</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function History() {
  return (
    <ProtectedRoute requireAuth={true}>
      <HistoryContent />
    </ProtectedRoute>
  );
}
