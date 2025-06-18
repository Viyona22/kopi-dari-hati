
import React from 'react';
import { ProductCard } from './ProductCard';
import { MenuItem } from '@/lib/supabase';

interface MenuSectionProps {
  items: MenuItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
