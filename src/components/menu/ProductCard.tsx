
import React, { useState } from 'react';
import { OrderCounter } from './OrderCounter';
import { ReviewDialog } from './ReviewDialog';
import { ReviewsList } from './ReviewsList';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { useReviewData } from '@/hooks/useReviewData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  description?: string;
  badge?: 'terlaris' | 'baru' | null;
  rating?: number;
  stockLeft?: number;
}

export function ProductCard({ image, name, price, description, badge, stockLeft }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const id = name.toLowerCase().replace(/\s+/g, '-');
  
  // Use real review data
  const { averageRating, totalReviews, refreshReviews } = useReviewData(id);
  
  // Use real rating if available, otherwise fall back to prop
  const displayRating = totalReviews > 0 ? averageRating : 4.5;

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
        
        {/* Rating with Review Count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(displayRating)}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {displayRating.toFixed(1)}
          </span>
          {totalReviews > 0 && (
            <span className="text-xs text-gray-500">
              ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
            </span>
          )}
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
        
        {/* Review Buttons */}
        <div className="flex gap-2 mb-3">
          <ReviewDialog 
            menuItemId={id}
            menuItemName={name}
            onReviewSubmitted={refreshReviews}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs border-[#d4462d] text-[#d4462d] hover:bg-[#d4462d] hover:text-white"
            >
              <Star className="w-3 h-3 mr-1" />
              Beri Rating
            </Button>
          </ReviewDialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Lihat Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-[#d4462d]">
                  Review untuk {name}
                </DialogTitle>
              </DialogHeader>
              <ReviewsList menuItemId={id} />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Order Counter */}
        <OrderCounter id={id} name={name} price={price} image={image} />
      </div>
    </div>
  );
}
