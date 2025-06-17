
import React from 'react';
import { ProductCard } from './ProductCard';
import { MenuItem } from '@/lib/supabase';

interface MenuSectionProps {
  items: MenuItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  // Function to determine badge based on item properties
  const getBadge = (item: MenuItem, index: number): 'terlaris' | 'baru' | null => {
    // Show "BARU" for recently added items (first 2 items)
    if (index < 2) return 'baru';
    
    // Show "TERLARIS" for every 3rd item (simulating popular items)
    if ((index + 1) % 3 === 0) return 'terlaris';
    
    return null;
  };

  // Function to generate random rating
  const getRandomRating = () => {
    const ratings = [4.2, 4.5, 4.7, 4.8, 4.3, 4.6, 4.9];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  // Function to generate random stock left
  const getRandomStock = () => {
    const shouldHaveStock = Math.random() > 0.7; // 30% chance of low stock
    return shouldHaveStock ? Math.floor(Math.random() * 5) + 1 : undefined;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <ProductCard
          key={item.id}
          image={item.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'}
          name={item.name}
          price={item.price}
          description={item.description}
          badge={getBadge(item, index)}
          rating={getRandomRating()}
          stockLeft={getRandomStock()}
        />
      ))}
    </div>
  );
}
