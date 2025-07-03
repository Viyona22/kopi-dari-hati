
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MenuSection } from '../components/menu/MenuSection';
import { useMenuData } from '../hooks/useMenuData';
import { useCategoryData } from '../hooks/useCategoryData';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Menu() {
  const { menuItems, loading } = useMenuData();
  const { categories, loading: categoriesLoading } = useCategoryData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const isMobile = useIsMobile();

  const allCategories = [
    { id: 'all', name: 'all', display_name: 'SEMUA MENU' },
    ...categories
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading || categoriesLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-[#d4462d]">
            Memuat menu...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="text-center mb-12">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true" 
            alt="Logo" 
            className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 rounded-full`} 
          />
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-[#d4462d] mb-4`}>
            Menu Kopi dari Hati
          </h1>
          <p className={`text-[#d4462d] ${isMobile ? 'text-sm' : ''}`}>
            Nikmati cita rasa autentik Bangka dalam setiap sajian
          </p>
        </section>

        {/* Category Filter */}
        <div className={`flex justify-center mb-8 ${isMobile ? 'px-2' : ''}`}>
          <div className={`bg-[rgba(227,167,107,0.24)] ${isMobile ? 'rounded-2xl p-1 w-full max-w-full overflow-x-auto' : 'rounded-full p-2'}`}>
            <div className={`flex ${isMobile ? 'gap-2 pb-2' : 'gap-1'} ${isMobile ? 'min-w-max' : ''}`}>
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`${isMobile ? 'px-4 py-2 text-sm flex-shrink-0' : 'px-6 py-2 mx-1'} rounded-full font-medium transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-[#d4462d] text-white shadow-md'
                      : 'text-[#d4462d] hover:bg-[rgba(212,70,45,0.1)]'
                  }`}
                >
                  {isMobile && category.display_name.length > 12 
                    ? category.display_name.substring(0, 10) + '...'
                    : category.display_name.toUpperCase()
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <MenuSection items={filteredItems} />

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-[#d4462d] ${isMobile ? 'text-base' : 'text-lg'}`}>
              Belum ada menu tersedia untuk kategori ini
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
