
import React from 'react';
import { OrderCounter } from './OrderCounter';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  description?: string;
}

export function ProductCard({ image, name, price, description }: ProductCardProps) {
  // Create a unique ID from the name (not ideal for production, but works for demo)
  const id = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-[rgba(227,167,107,0.24)] p-4 rounded-[50px]">
      <div className="flex justify-between items-center mb-4">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/9d2ec89e508b94cd7ab9fe52c8f4c32fbb6f1377?placeholderIfAbsent=true" alt="Logo" className="w-12 h-12 rounded-[30px]" />
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ea00eabc2556241db5cbfaa7ea7ca4c97054bf96?placeholderIfAbsent=true" alt="Profile" className="w-16 h-16 rounded-full" />
      </div>

      <div className="bg-[rgba(227,167,107,0.24)] p-6 rounded-[50px] text-center">
        <img src={image} alt={name} className="w-full aspect-square object-cover rounded-full mb-4" />
        <h3 className="text-xl font-bold text-[#d4462d] mb-2">{name}</h3>
        {description && (
          <p className="text-[#d4462d] mb-2">{description}</p>
        )}
        <p className="text-xl font-bold text-[#d4462d]">Rp. {price.toLocaleString()}</p>
      </div>

      <OrderCounter id={id} name={name} price={price} image={image} />
    </div>
  );
}
