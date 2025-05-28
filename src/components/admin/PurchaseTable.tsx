
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

export function PurchaseTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const purchases = [
    {
      no: 1,
      tanggal: "24/05/2024",
      produk: "Sunblock",
      total: "Rp150.000",
      status: "Selesai"
    },
    {
      no: 2,
      tanggal: "22/05/2024",
      produk: "Moisturizer",
      total: "Rp200.000",
      status: "Diproses"
    },
    {
      no: 3,
      tanggal: "22/05/2024",
      produk: "Face Wash",
      total: "Rp80.000",
      status: "Dibatalkan"
    },
    {
      no: 4,
      tanggal: "20/05/2024",
      produk: "Serum",
      total: "Rp140.000",
      status: "Selesai"
    }
  ];

  const filteredPurchases = purchases.filter(purchase =>
    purchase.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.tanggal.includes(searchTerm)
  );

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 mb-6">
          Riwayat Pembelian
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
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">No</TableHead>
              <TableHead className="font-semibold text-gray-700">Tanggal</TableHead>
              <TableHead className="font-semibold text-gray-700">Produk</TableHead>
              <TableHead className="font-semibold text-gray-700">Total</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.no} className="hover:bg-gray-50">
                <TableCell className="font-medium">{purchase.no}</TableCell>
                <TableCell>{purchase.tanggal}</TableCell>
                <TableCell>{purchase.produk}</TableCell>
                <TableCell className="font-medium">{purchase.total}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(purchase.status)}>
                    {purchase.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
