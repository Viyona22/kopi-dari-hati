
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Trash, Edit, Save, X } from 'lucide-react';
import { useReservationData } from '@/hooks/useReservationData';
import { Reservation } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ReservationTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { reservations, loading, updateReservationStatus, deleteReservation } = useReservationData();

  const filteredReservations = reservations.filter(reservation =>
    reservation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.date?.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Menunggu':
        return 'bg-orange-100 text-orange-800';
      case 'Batal':
        return 'bg-red-100 text-red-800';
      case 'Dalam Proses':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Menunggu' | 'Dalam Proses' | 'Selesai' | 'Batal') => {
    try {
      await updateReservationStatus(id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      try {
        await deleteReservation(id);
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            Memuat data reservasi...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 mb-6">
          Data Reservasi
        </CardTitle>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari reservasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada data reservasi
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Nama</TableHead>
                <TableHead className="font-semibold text-gray-700">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-700">Jumlah Tamu</TableHead>
                <TableHead className="font-semibold text-gray-700">Waktu</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{reservation.name}</TableCell>
                  <TableCell>{reservation.date}</TableCell>
                  <TableCell>{reservation.guests}</TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>
                    <Select
                      value={reservation.status}
                      onValueChange={(value) => handleStatusChange(reservation.id, value as any)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Menunggu">
                          <Badge className="bg-orange-100 text-orange-800">
                            Menunggu
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Dalam Proses">
                          <Badge className="bg-blue-100 text-blue-800">
                            Dalam Proses
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Selesai">
                          <Badge className="bg-green-100 text-green-800">
                            Selesai
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Batal">
                          <Badge className="bg-red-100 text-red-800">
                            Batal
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
