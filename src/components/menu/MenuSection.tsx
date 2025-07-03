
import React from 'react';
import { ProductCard } from './ProductCard';
import { MenuItem } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuSectionProps {
  items: MenuItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`grid ${
      isMobile 
        ? 'grid-cols-1 sm:grid-cols-2 gap-4' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    } justify-items-center`}>
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
