
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowLeft } from 'lucide-react';
import { PaymentMethodDisplay } from '@/components/payment/PaymentMethodDisplay';
import { PaymentProofUpload } from '@/components/payment/PaymentProofUpload';
import { PaymentTimer } from '@/components/payment/PaymentTimer';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import { toast } from '@/hooks/use-toast';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { savePurchase } = usePurchaseData();
  const [orderData, setOrderData] = useState(null);
  const [purchaseId, setPurchaseId] = useState(null);
  const [paymentDeadline, setPaymentDeadline] = useState(null);

  useEffect(() => {
    const data = location.state?.orderData;
    if (!data) {
      navigate('/checkout');
      return;
    }
    setOrderData(data);
    
    // Create purchase record when payment page loads
    createPurchaseRecord(data);
  }, [location.state, navigate]);

  const createPurchaseRecord = async (data) => {
    try {
      const purchaseData = {
        ...data,
        payment_status: 'pending',
        payment_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      const result = await savePurchase(purchaseData);
      setPurchaseId(result.id);
      setPaymentDeadline(result.payment_deadline);
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat pesanan. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const handleBackToCheckout = () => {
    navigate('/checkout');
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Bukti Pembayaran Berhasil Diunggah",
      description: "Pesanan Anda sedang menunggu verifikasi admin. Kami akan menghubungi Anda segera.",
    });
    
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (!orderData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Memuat halaman pembayaran...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToCheckout}
            className="text-[#d4462d] hover:bg-[rgba(212,70,45,0.1)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Checkout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#d4462d] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Nama: {orderData.customer_name}</p>
                  <p className="text-sm text-gray-600">Telepon: {orderData.customer_phone}</p>
                  {orderData.customer_address && (
                    <p className="text-sm text-gray-600">Alamat: {orderData.customer_address}</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Item Pesanan:</h4>
                  {orderData.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x Rp. {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-medium">Rp. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold text-[#d4462d]">
                  <p>Total Tagihan:</p>
                  <p>Rp. {orderData.total_amount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {paymentDeadline && (
              <PaymentTimer deadline={paymentDeadline} />
            )}
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <PaymentMethodDisplay paymentMethod={orderData.payment_method} />
            
            {purchaseId && (
              <PaymentProofUpload 
                purchaseId={purchaseId}
                onUploadComplete={handlePaymentComplete}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
