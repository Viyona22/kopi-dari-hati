
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { PAYMENT_METHODS, validatePaymentMethod } from '@/components/payment/PaymentConstants';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { PaymentMethodDisplay } from '@/components/payment/PaymentMethodDisplay';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  phone: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 digit" }),
  address: z.string().optional(),
  paymentMethod: z.string().min(1, { message: "Pilih metode pembayaran" }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { paymentMethods, loading: settingsLoading } = useCafeSettings();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      paymentMethod: '',
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    console.log('=== CHECKOUT SUBMIT DEBUG ===');
    console.log('Form data:', data);
    console.log('Selected payment method:', data.paymentMethod);
    
    // Get available payment methods
    const availablePaymentMethods = getAvailablePaymentMethods();
    console.log('Available payment methods:', availablePaymentMethods);
    
    // Validate payment method exists in available methods
    if (!availablePaymentMethods.includes(data.paymentMethod)) {
      console.error('Payment method not in available methods:', data.paymentMethod);
      console.error('Available methods:', availablePaymentMethods);
      return;
    }

    // Additional validation using database constraint validation
    if (!validatePaymentMethod(data.paymentMethod)) {
      console.error('Payment method failed database validation:', data.paymentMethod);
      return;
    }
    
    console.log('✅ Payment method validation passed');
    
    // Prepare order data
    const orderData = {
      customer_name: data.name,
      customer_phone: data.phone,
      customer_address: data.address || null,
      order_items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total_amount: totalPrice,
      payment_method: data.paymentMethod, // Use exact value from form
      status: 'Diproses' as const
    };

    console.log('Final order data:', orderData);

    // Clear cart before navigating
    clearCart();

    // Navigate to payment page with order data
    const tempId = Date.now().toString();
    console.log('Navigating to payment with temp ID:', tempId);
    
    navigate(`/payment/${tempId}`, { 
      state: { orderData } 
    });
  }

  // Get available payment methods from admin settings
  const getAvailablePaymentMethods = () => {
    const methods = [];
    
    console.log('=== PAYMENT METHODS AVAILABILITY CHECK ===');
    console.log('Payment methods config:', paymentMethods);
    
    if (paymentMethods?.qris?.enabled && paymentMethods?.qris?.value) {
      console.log('✅ QRIS is enabled and configured');
      methods.push(PAYMENT_METHODS.QRIS);
    }
    
    if (paymentMethods?.bank?.enabled && paymentMethods?.bank?.account) {
      console.log('✅ Bank transfer is enabled and configured');
      console.log('Bank account details:', paymentMethods.bank.account);
      methods.push(PAYMENT_METHODS.BANK_TRANSFER);
    }
    
    if (paymentMethods?.ewallet?.enabled) {
      const enabledWallets = Object.entries(paymentMethods.ewallet.options || {})
        .filter(([_, enabled]) => enabled);
      console.log('E-wallet enabled wallets:', enabledWallets);
      if (enabledWallets.length > 0) {
        console.log('✅ E-wallet is enabled with options');
        methods.push(PAYMENT_METHODS.EWALLET);
      }
    }
    
    console.log('Final available methods for checkout:', methods);
    return methods;
  };

  const availablePaymentMethods = getAvailablePaymentMethods();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#d4462d] mb-6">Checkout</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Keranjang Anda kosong</p>
            <Link to="/menu">
              <Button className="bg-[#d4462d] hover:bg-[#b33a25]">
                Lihat Menu
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (settingsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Memuat halaman checkout...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#d4462d] mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Form Checkout</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nomor telepon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Pengantaran (opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan alamat pengantaran" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metode Pembayaran</FormLabel>
                      <FormControl>
                        <PaymentMethodDisplay
                          selectedMethod={field.value}
                          onMethodChange={(method) => {
                            console.log('Payment method selected in form:', method);
                            field.onChange(method);
                          }}
                          availableMethods={availablePaymentMethods}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {availablePaymentMethods.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      Belum ada metode pembayaran yang diaktifkan. Silakan hubungi admin.
                    </p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#d4462d] hover:bg-[#b33a25]"
                  disabled={availablePaymentMethods.length === 0}
                >
                  Lanjut ke Pembayaran
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x Rp. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="font-medium">Rp. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>Rp. {totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
