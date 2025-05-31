
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Trash } from 'lucide-react';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const { purchases, loading, updatePurchaseStatus, deletePurchase } = usePurchaseData();

  const handleStatusChange = async (purchaseId: string, newStatus: 'Diproses' | 'Selesai' | 'Dibatalkan') => {
    try {
      await updatePurchaseStatus(purchaseId, newStatus);
    } catch (error) {
      console.error('Error updating purchase status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pembelian ini?')) {
      try {
        await deletePurchase(id);
      } catch (error) {
        console.error('Error deleting purchase:', error);
      }
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.date?.includes(searchTerm)
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            Memuat data pembelian...
          </div>
        </CardContent>
      </Card>
    );
  }

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
              placeholder="Cari pembelian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada data pembelian
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-700">Produk</TableHead>
                <TableHead className="font-semibold text-gray-700">Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id} className="hover:bg-gray-50">
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.product}</TableCell>
                  <TableCell className="font-medium">{purchase.total}</TableCell>
                  <TableCell>
                    <Select
                      value={purchase.status}
                      onValueChange={(value) => handleStatusChange(purchase.id, value as any)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <Badge className={getStatusColor(purchase.status)}>
                          {purchase.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diproses">
                          <Badge className="bg-orange-100 text-orange-800">
                            Diproses
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Selesai">
                          <Badge className="bg-green-100 text-green-800">
                            Selesai
                          </Badge>
                        </SelectItem>
                        <SelectItem value="Dibatalkan">
                          <Badge className="bg-red-100 text-red-800">
                            Dibatalkan
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(purchase.id)}
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
