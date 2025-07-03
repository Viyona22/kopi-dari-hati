
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Trash, Eye, Image as ImageIcon, Check, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function PurchaseTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { purchases, loading, updatePurchaseStatus, deletePurchase, refreshData } = usePurchaseData();

  const handleStatusChange = async (purchaseId: string, newStatus: 'Diproses' | 'Selesai' | 'Dibatalkan') => {
    try {
      await updatePurchaseStatus(purchaseId, newStatus);
    } catch (error) {
      console.error('Error updating purchase status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (purchaseId: string, newStatus: 'verified' | 'failed') => {
    try {
      const { error } = await supabase
        .from('purchases')
        .update({ payment_status: newStatus })
        .eq('id', purchaseId);

      if (error) throw error;

      // Update payment proof status if exists
      await supabase
        .from('payment_proofs')
        .update({ 
          status: newStatus === 'verified' ? 'verified' : 'rejected',
          verified_at: new Date().toISOString(),
          verified_by: 'admin' // In a real app, this would be the admin's ID
        })
        .eq('purchase_id', purchaseId);

      await refreshData();
      toast({
        title: "Status Pembayaran Diperbarui",
        description: `Pembayaran ${newStatus === 'verified' ? 'diverifikasi' : 'ditolak'}`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status pembayaran",
        variant: "destructive"
      });
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
    purchase.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.customer_phone?.includes(searchTerm) ||
    purchase.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'qris':
        return 'QRIS';
      case 'transfer':
        return 'Transfer Bank';
      default:
        return method;
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
                <TableHead className="font-semibold text-gray-700">Waktu</TableHead>
                <TableHead className="font-semibold text-gray-700">Pelanggan</TableHead>
                <TableHead className="font-semibold text-gray-700">Kontak</TableHead>
                <TableHead className="font-semibold text-gray-700">Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Pembayaran</TableHead>
                <TableHead className="font-semibold text-gray-700">Status Bayar</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm">
                    {purchase.created_at ? formatDate(purchase.created_at) : '-'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{purchase.customer_name}</div>
                      {purchase.customer_address && (
                        <div className="text-sm text-gray-500">{purchase.customer_address}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{purchase.customer_phone}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(purchase.total_amount)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getPaymentMethodLabel(purchase.payment_method)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getPaymentStatusColor(purchase.payment_status || 'pending')}>
                        {purchase.payment_status === 'verified' ? 'Terverifikasi' :
                         purchase.payment_status === 'uploaded' ? 'Menunggu Verifikasi' :
                         purchase.payment_status === 'pending' ? 'Belum Bayar' : 'Gagal'}
                      </Badge>
                      {purchase.payment_status === 'uploaded' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-green-600 hover:bg-green-50"
                            onClick={() => handlePaymentStatusUpdate(purchase.id, 'verified')}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-red-600 hover:bg-red-50"
                            onClick={() => handlePaymentStatusUpdate(purchase.id, 'failed')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
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
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detail Pembelian</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Nama Pelanggan</label>
                                <p className="font-medium">{purchase.customer_name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Nomor Telepon</label>
                                <p className="font-medium">{purchase.customer_phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Alamat Pengantaran</label>
                                <p className="font-medium">{purchase.customer_address || 'Tidak ada alamat'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Metode Pembayaran</label>
                                <p className="font-medium">{getPaymentMethodLabel(purchase.payment_method)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Status Pembayaran</label>
                                <Badge className={getPaymentStatusColor(purchase.payment_status || 'pending')}>
                                  {purchase.payment_status === 'verified' ? 'Terverifikasi' :
                                   purchase.payment_status === 'uploaded' ? 'Menunggu Verifikasi' :
                                   purchase.payment_status === 'pending' ? 'Belum Bayar' : 'Gagal'}
                                </Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Waktu Pemesanan</label>
                                <p className="font-medium">
                                  {purchase.created_at ? formatDate(purchase.created_at) : '-'}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Status</label>
                                <Badge className={getStatusColor(purchase.status)}>
                                  {purchase.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Payment Proof Section */}
                            {purchase.payment_status === 'uploaded' && (
                              <div>
                                <label className="text-sm font-medium text-gray-600 mb-2 block">Bukti Pembayaran</label>
                                <PaymentProofViewer purchaseId={purchase.id} />
                              </div>
                            )}
                            
                            <div>
                              <label className="text-sm font-medium text-gray-600 mb-2 block">Items Pembelian</label>
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Harga</TableHead>
                                      <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {purchase.order_items.map((item: any, index: number) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            {item.image && (
                                              <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                                            )}
                                            {item.name}
                                          </div>
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{formatCurrency(item.price)}</TableCell>
                                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="mt-4 text-right">
                                <div className="text-lg font-bold">
                                  Total: {formatCurrency(purchase.total_amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(purchase.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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

// Component to view payment proof
function PaymentProofViewer({ purchaseId }: { purchaseId: string }) {
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPaymentProof = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_proofs')
          .select('proof_image_url')
          .eq('purchase_id', purchaseId)
          .single();

        if (error) throw error;
        setProofUrl(data.proof_image_url);
      } catch (error) {
        console.error('Error fetching payment proof:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentProof();
  }, [purchaseId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Memuat bukti pembayaran...</div>;
  }

  if (!proofUrl) {
    return <div className="text-sm text-gray-500">Tidak ada bukti pembayaran</div>;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <img 
        src={proofUrl} 
        alt="Payment proof" 
        className="max-w-full max-h-64 object-contain mx-auto border rounded"
      />
      <div className="text-center mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(proofUrl, '_blank')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Lihat Gambar Penuh
        </Button>
      </div>
    </div>
  );
}
