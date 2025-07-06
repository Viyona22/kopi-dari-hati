
import React, { useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useMenuData } from '@/hooks/useMenuData';
import { Star, Heart } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { useIsMobile } from '@/hooks/use-mobile';

export function MenuCarousel() {
  const { menuItems, loading, error } = useMenuData();
  const isMobile = useIsMobile();
  
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-[#d4462d] text-[#d4462d]" />
      );
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
          MENU SPESIAL KAMI
        </h2>
        <div className="text-center py-8 text-[#d4462d]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4462d] mx-auto mb-4"></div>
          <p>Memuat menu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-16">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
          MENU SPESIAL KAMI
        </h2>
        <div className="text-center py-8 text-red-500">
          <p>Gagal memuat menu. Silakan coba lagi.</p>
        </div>
      </section>
    );
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <section className="mb-16">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
          MENU SPESIAL KAMI
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada menu yang tersedia.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
        MENU SPESIAL KAMI
      </h2>
      <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto`}>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {menuItems.map((item, index) => (
              <CarouselItem key={item.id} className={isMobile ? 'basis-full' : 'md:basis-1/2 lg:basis-1/3'}>
                <div className="p-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative">
                      <img 
                        src={item.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'} 
                        alt={item.name} 
                        className={`w-full ${isMobile ? 'h-48' : 'h-40'} object-cover`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png';
                        }}
                      />
                      
                      {/* Badge for first few items */}
                      {index < 3 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-[#d4462d]">
                          SPESIAL
                        </div>
                      )}
                      
                      {/* Heart icon */}
                      <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div className={`${isMobile ? 'p-5' : 'p-4'}`}>
                      <h3 className={`${isMobile ? 'text-lg' : 'text-base'} font-bold text-gray-800 mb-2`}>{item.name}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(4.5)}
                        <span className="text-xs text-gray-600 ml-1">4.5</span>
                      </div>
                      
                      {item.description && (
                        <p className={`text-[#d4462d] ${isMobile ? 'text-sm' : 'text-xs'} line-clamp-2 mb-2`}>{item.description}</p>
                      )}
                      
                      <p className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-[#d4462d]`}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
