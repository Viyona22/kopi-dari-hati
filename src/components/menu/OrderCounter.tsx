import React, { useState } from 'react';

export function OrderCounter() {
  const [count, setCount] = useState(0);
  const price = 0; // This would be calculated based on the count and item price

  return (
    <div className="bg-[rgba(227,167,107,0.24)] flex items-center justify-between p-3 rounded-[50px] mt-4">
      <div className="flex items-center gap-4 text-xl">
        <span className="text-[#d4462d] font-bold">Pesanan</span>
        <button
          onClick={() => setCount(Math.max(0, count - 1))}
          className="bg-[rgba(217,217,217,1)] w-8 h-8 rounded-full flex items-center justify-center text-black"
        >
          -
        </button>
        <span className="text-black">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-[rgba(217,217,217,1)] w-8 h-8 rounded-full flex items-center justify-center text-black"
        >
          +
        </button>
      </div>
      <span className="text-[#d4462d] font-bold text-xl">
        Rp. {price.toLocaleString()}
      </span>
    </div>
  );
}
