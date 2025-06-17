
import React, { useState } from 'react';
import { OrderCounter } from './OrderCounter';
import { Star, Heart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  description?: string;
  badge?: 'terlaris' | 'baru' | null;
  rating?: number;
  stockLeft?: number;
}

export function ProductCard({ image, name, price, description, badge, rating = 4.5, stockLeft }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const id = name.toLowerCase().replace(/\s+/g, '-');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-[#d4462d] text-[#d4462d]" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 fill-[#d4462d] text-[#d4462d] opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 max-w-sm mx-auto">
      {/* Image Section with Badge and Favorite */}
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-36 object-cover" 
        />
        
        {/* Badge */}
        {badge && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
            badge === 'terlaris' ? 'bg-[#d4462d]' : 'bg-orange-500'
          }`}>
            {badge === 'terlaris' ? 'TERLARIS' : 'BARU'}
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3">
        <h3 className="text-base font-bold text-gray-800 mb-1.5 line-clamp-1">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(rating)}
          </div>
          <span className="text-xs text-gray-600 font-medium">{rating}</span>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{description}</p>
        )}
        
        {/* Stock Warning */}
        {stockLeft && stockLeft <= 5 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-orange-500"></div>
            <span className="text-orange-600 text-xs font-medium">
              Tersisa {stockLeft} porsi!
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-[#d4462d]">
            Rp {price.toLocaleString('id-ID')}
          </span>
        </div>
        
        {/* Order Counter */}
        <OrderCounter id={id} name={name} price={price} image={image} />
      </div>
    </div>
  );
}
