
import React, { useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useMenuData } from '@/hooks/useMenuData';
import Autoplay from 'embla-carousel-autoplay';

export function MenuCarousel() {
  const { menuItems, loading } = useMenuData();
  
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (loading) {
    return (
      <div className="text-center py-8 text-[#d4462d]">
        Memuat menu...
      </div>
    );
  }

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold text-[#d4462d] text-center mb-8">
        MENU SPESIAL KAMI
      </h2>
      <div className="max-w-4xl mx-auto">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {menuItems.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <div className="bg-[rgba(227,167,107,0.24)] p-6 rounded-[30px] text-center">
                    <img 
                      src={item.image || '/lovable-uploads/e5b13f61-142b-4b00-843c-3a4c4da053aa.png'} 
                      alt={item.name} 
                      className="w-full h-48 object-cover rounded-full mb-4" 
                    />
                    <h3 className="text-lg font-bold text-[#d4462d] mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-[#d4462d] text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-lg font-bold text-[#d4462d]">Rp. {item.price.toLocaleString()}</p>
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
