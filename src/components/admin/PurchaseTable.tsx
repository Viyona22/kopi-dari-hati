
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

export function PurchaseTable() {
  const purchases = [
    {
      no: 1,
      nama: "Dedi",
      waktuPesan: "25/05/2025",
      itemDibeli: "Kopi Susu",
      totalHarga: "Rp 35.000",
      metode: "QRIS"
    },
    {
      no: 2,
      nama: "Dedi",
      waktuPesan: "25/05/2025",
      itemDibeli: "Toast",
      totalHarga: "Rp 35.000",
      metode: "QRIS"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Riwayat Pembelian</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">25/05/2025</span>
            <Input
              type="date"
              className="w-40"
              defaultValue="2025-05-25"
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
              <TableHead>Waktu Pesan</TableHead>
              <TableHead>Item Dibeli</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Metode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.no}>
                <TableCell>{purchase.no}</TableCell>
                <TableCell>{purchase.nama}</TableCell>
                <TableCell>{purchase.waktuPesan}</TableCell>
                <TableCell>{purchase.itemDibeli}</TableCell>
                <TableCell>{purchase.totalHarga}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {purchase.metode}
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
