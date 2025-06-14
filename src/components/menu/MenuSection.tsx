
import React from 'react';
import { ProductCard } from './ProductCard';
import { MenuItem } from '@/lib/supabase';

interface MenuSectionProps {
  items: MenuItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          image={item.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'}
          name={item.name}
          price={item.price}
          description={item.description}
        />
      ))}
    </div>
  );
}
