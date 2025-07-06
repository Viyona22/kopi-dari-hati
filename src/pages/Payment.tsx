
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowLeft } from 'lucide-react';
import { PaymentMethodDetail } from '@/components/payment/PaymentMethodDetail';
import { PaymentMethodChangeModal } from '@/components/payment/PaymentMethodChangeModal';
import { PaymentProofUpload } from '@/components/payment/PaymentProofUpload';
import { PaymentTimer } from '@/components/payment/PaymentTimer';
import { usePurchaseData } from '@/hooks/usePurchaseData';
import { toast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { VALID_PAYMENT_METHODS } from '@/components/payment/PaymentConstants';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { purchaseId } = useParams();
  const { savePurchase, updatePaymentMethod, purchases } = usePurchaseData();
  const { user } = useAuthContext();
  const [orderData, setOrderData] = useState(null);
  const [finalPurchaseId, setFinalPurchaseId] = useState(purchaseId);
  const [paymentDeadline, setPaymentDeadline] = useState(null);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [isCreatingPurchase, setIsCreatingPurchase] = useState(false);
  
  // Use ref to prevent duplicate purchase creation
  const hasCreatedPurchase = useRef(false);
  const initializationComplete = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationComplete.current) return;

    console.log('Payment page loaded with params:', { purchaseId });
    console.log('Location state:', location.state);
    console.log('User authenticated:', !!user);
    
    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    
    const data = location.state?.orderData;
    if (!data) {
      // Try to find existing purchase if no order data
      if (purchaseId && purchases.length > 0) {
        const existingPurchase = purchases.find(p => p.id === purchaseId);
        if (existingPurchase) {
          setCurrentPurchase(existingPurchase);
          setOrderData({
            customer_name: existingPurchase.customer_name,
            customer_phone: existingPurchase.customer_phone,
            customer_address: existingPurchase.customer_address,
            order_items: existingPurchase.order_items,
            total_amount: existingPurchase.total_amount,
            payment_method: existingPurchase.payment_method
          });
          setPaymentDeadline(existingPurchase.payment_deadline);
          initializationComplete.current = true;
          return;
        }
      }
      
      console.log('No order data found, redirecting to checkout');
      navigate('/checkout');
      return;
    }

    // Validate payment method before creating purchase
    if (!VALID_PAYMENT_METHODS.includes(data.payment_method)) {
      console.error('Invalid payment method:', data.payment_method);
      toast({
        title: "Error",
        description: "Metode pembayaran tidak valid. Silakan pilih ulang metode pembayaran.",
        variant: "destructive"
      });
      navigate('/checkout');
      return;
    }
    
    setOrderData(data);
    initializationComplete.current = true;
    
    // Create purchase record when payment page loads (only once)
    if (!hasCreatedPurchase.current && !purchaseId) {
      createPurchaseRecord(data);
    }
  }, [location.state, navigate, purchaseId, purchases, user]); // Remove dependencies that cause re-runs

  const createPurchaseRecord = async (data) => {
    // Prevent duplicate creation
    if (isCreatingPurchase || hasCreatedPurchase.current) {
      console.log('Purchase creation already in progress or completed');
      return;
    }
    
    try {
      setIsCreatingPurchase(true);
      hasCreatedPurchase.current = true; // Mark as started immediately
      console.log('Creating purchase record with data:', data);
      
      const purchaseData = {
        ...data,
        payment_status: 'pending',
        payment_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log('Saving purchase with user_id:', purchaseData);
      const result = await savePurchase(purchaseData);
      console.log('Purchase record created:', result);
      
      setFinalPurchaseId(result.id);
      setCurrentPurchase(result);
      setPaymentDeadline(result.payment_deadline);
    } catch (error) {
      console.error('Error creating purchase:', error);
      hasCreatedPurchase.current = false; // Reset on error
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat pesanan. Silakan coba lagi.",
        variant: "destructive"
      });
      navigate('/checkout');
    } finally {
      setIsCreatingPurchase(false);
    }
  };

  const handlePaymentMethodChange = async (newPaymentMethod: string) => {
    if (!finalPurchaseId) return;
    
    try {
      await updatePaymentMethod(finalPurchaseId, newPaymentMethod);
      
      // Update local order data
      setOrderData(prev => ({
        ...prev,
        payment_method: newPaymentMethod
      }));

      // Update current purchase
      if (currentPurchase) {
        setCurrentPurchase(prev => ({
          ...prev,
          payment_method: newPaymentMethod,
          payment_proof_id: null
        }));
      }
    } catch (error) {
      throw error; // Re-throw to be handled by the modal
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

  // Check if payment method can be changed
  const canChangePaymentMethod = currentPurchase && 
    currentPurchase.payment_status === 'pending' && 
    !currentPurchase.payment_proof_id &&
    currentPurchase.status !== 'Selesai' &&
    currentPurchase.status !== 'Dibatalkan';

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Silakan login terlebih dahulu untuk melanjutkan pembayaran.</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            onClick={() => navigate('/checkout')}
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Metode Pembayaran</h3>
                {currentPurchase && currentPurchase.payment_status === 'pending' && !currentPurchase.payment_proof_id && (
                  <PaymentMethodChangeModal
                    currentPaymentMethod={orderData.payment_method}
                    onPaymentMethodChange={async (newMethod) => {
                      await handlePaymentMethodChange(newMethod);
                      setOrderData(prev => ({ ...prev, payment_method: newMethod }));
                      if (currentPurchase) {
                        setCurrentPurchase(prev => ({ ...prev, payment_method: newMethod }));
                      }
                    }}
                  />
                )}
              </div>
              
              {currentPurchase?.payment_proof_id && (
                <p className="text-sm text-gray-500">
                  Metode pembayaran tidak dapat diubah karena bukti pembayaran sudah diunggah.
                </p>
              )}
            </div>

            <PaymentMethodDetail paymentMethod={orderData.payment_method} />
            
            {finalPurchaseId && (
              <PaymentProofUpload 
                purchaseId={finalPurchaseId}
                onUploadComplete={() => {
                  toast({
                    title: "Bukti Pembayaran Berhasil Diunggah",
                    description: "Pesanan Anda sedang menunggu verifikasi admin. Kami akan menghubungi Anda segera.",
                  });
                  
                  setTimeout(() => {
                    navigate('/');
                  }, 3000);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
