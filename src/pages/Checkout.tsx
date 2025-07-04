
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  phone: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 digit" }),
  address: z.string().optional(),
  paymentMethod: z.enum(['cod', 'qris', 'transfer'], { 
    required_error: "Pilih metode pembayaran" 
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'cod',
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    console.log('Starting checkout process with data:', data);
    
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
      payment_method: data.paymentMethod,
      status: 'Diproses' as const
    };

    console.log('Order data prepared:', orderData);

    // Clear cart before navigating
    clearCart();

    // Navigate to payment page with order data - use temporary ID for now
    const tempId = Date.now().toString();
    console.log('Navigating to payment with temp ID:', tempId);
    
    navigate(`/payment/${tempId}`, { 
      state: { orderData } 
    });
  }

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
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cod" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash on Delivery (COD)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="qris" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              QRIS
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Transfer Bank
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#d4462d] hover:bg-[#b33a25]"
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
