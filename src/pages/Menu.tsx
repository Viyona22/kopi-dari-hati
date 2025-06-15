
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MenuSection } from '../components/menu/MenuSection';
import { useMenuData } from '../hooks/useMenuData';
import { useCategoryData } from '../hooks/useCategoryData';

export default function Menu() {
  const { menuItems, loading } = useMenuData();
  const { categories, loading: categoriesLoading } = useCategoryData();
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
            className="w-16 h-16 mx-auto mb-4 rounded-full" 
          />
          <h1 className="text-3xl font-bold text-[#d4462d] mb-4">
            Menu Kopi dari Hati
          </h1>
          <p className="text-[#d4462d]">
            Nikmati cita rasa autentik Bangka dalam setiap sajian
          </p>
        </section>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-[rgba(227,167,107,0.24)] rounded-full p-2">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 mx-1 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#d4462d] text-white'
                    : 'text-[#d4462d] hover:bg-[rgba(212,70,45,0.1)]'
                }`}
              >
                {category.display_name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <MenuSection items={filteredItems} />

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#d4462d] text-lg">
              Belum ada menu tersedia untuk kategori ini
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
