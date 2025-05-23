
import React from 'react';
import { useCart } from '@/context/CartContext';

interface OrderCounterProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function OrderCounter({ id, name, price, image }: OrderCounterProps) {
  const { items, addItem, updateQuantity } = useCart();
  
  // Find this item in the cart
  const cartItem = items.find(item => item.id === id);
  const count = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
  };

  const handleUpdateQuantity = (newCount: number) => {
    updateQuantity(id, newCount);
  };

  return (
    <div className="bg-[rgba(227,167,107,0.24)] flex items-center justify-between p-3 rounded-[50px] mt-4">
      <div className="flex items-center gap-4 text-xl">
        <span className="text-[#d4462d] font-bold">Pesanan</span>
        <button
          onClick={() => count > 0 ? handleUpdateQuantity(count - 1) : null}
          className="bg-[rgba(217,217,217,1)] w-8 h-8 rounded-full flex items-center justify-center text-black"
        >
          -
        </button>
        <span className="text-black">{count}</span>
        <button
          onClick={() => count > 0 ? handleUpdateQuantity(count + 1) : handleAddToCart()}
          className="bg-[rgba(217,217,217,1)] w-8 h-8 rounded-full flex items-center justify-center text-black"
        >
          +
        </button>
      </div>
      <span className="text-[#d4462d] font-bold text-xl">
        Rp. {(price * count).toLocaleString()}
      </span>
    </div>
  );
}
