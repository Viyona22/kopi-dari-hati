
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';

export function ReservationTable() {
  const reservations = [
    {
      no: 1,
      nama: "Rina",
      tanggal: "25/05/2025",
      jumlahTamu: 2,
      waktu: "19:00",
      status: "Selesai"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Riwayat Reservasi</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jumlah Tamu</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.no}>
                <TableCell>{reservation.no}</TableCell>
                <TableCell>{reservation.nama}</TableCell>
                <TableCell>{reservation.tanggal}</TableCell>
                <TableCell>{reservation.jumlahTamu}</TableCell>
                <TableCell>{reservation.waktu}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {reservation.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
