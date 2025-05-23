
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#d4462d] mb-6">Keranjang</h1>
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
        <h1 className="text-2xl font-bold text-[#d4462d] mb-6">Keranjang</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Cart</h2>
              
              {items.map((item) => (
                <div key={item.id} className="border-b py-4 flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-[#d4462d] font-bold">Rp. {item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 p-1 rounded-md"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 p-1 rounded-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="ml-4 w-24 text-right">
                    Rp. {(item.price * item.quantity).toLocaleString()}
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <div className="mt-4 text-right">
                <p className="text-lg font-bold">Total: Rp. {totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Checkout</h2>
            <Link to="/checkout">
              <Button className="w-full bg-[#d4462d] hover:bg-[#b33a25]">
                Lanjut ke Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
