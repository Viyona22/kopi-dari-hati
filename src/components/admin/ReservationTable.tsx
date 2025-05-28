
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ReservationTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations] = useState<any[]>([]);

  const filteredReservations = reservations.filter(reservation =>
    reservation.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.tanggal?.includes(searchTerm)
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
              placeholder="Search..."
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
                <TableHead className="font-semibold text-gray-700">No</TableHead>
                <TableHead className="font-semibold text-gray-700">Nama</TableHead>
                <TableHead className="font-semibold text-gray-700">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-700">Jumlah Tamu</TableHead>
                <TableHead className="font-semibold text-gray-700">Waktu</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.no} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{reservation.no}</TableCell>
                  <TableCell>{reservation.nama}</TableCell>
                  <TableCell>{reservation.tanggal}</TableCell>
                  <TableCell>{reservation.jumlahTamu}</TableCell>
                  <TableCell>{reservation.waktu}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
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
