
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/menu/ProductCard';
import { SearchBar } from '../components/ui/SearchBar';

export default function Menu() {
  const specialCoffees = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/6268e9cdd7ad0a1667165091747429dfd0387b0a?placeholderIfAbsent=true',
      name: 'Ice Kopi Susu',
      price: 22000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a882cffbb4f2ef179c6a7a20f67fd69443be1db2?placeholderIfAbsent=true',
      name: 'Ice Matcha Espresso',
      price: 30000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/4ea9f3e5c46371c16d658e202c231a36de7c3475?placeholderIfAbsent=true',
      name: 'Ice Chocolate',
      price: 25000
    }
  ];

  const snacks = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f10dffeee6529562c0b99f546f2f4c96cdb9ba5e?placeholderIfAbsent=true',
      name: 'Pisang Coklat',
      price: 10000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/4a0a584836e3ce06c11dffacb9dcd5522a6327a0?placeholderIfAbsent=true',
      name: 'Empek-empek Telur',
      price: 15000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f0f4fd16a6d97a6dc113a44c15964b892a116c50?placeholderIfAbsent=true',
      name: 'Roti Bakar',
      price: 12000
    }
  ];

  const meals = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a87859f430c9606fa779269879c949fad50d3f35?placeholderIfAbsent=true',
      name: 'Original Beef Bowl',
      price: 40000,
      description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/730370f0e60278cceaf5ec3c12a79f907705529e?placeholderIfAbsent=true',
      name: 'Chicken Katsu',
      price: 35000,
      description: 'Ayam katsu renyah dengan saus khusus'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/023b16447e0cb928a69a828370ebd31bba33b8e3?placeholderIfAbsent=true',
      name: 'Mie Goreng Spesial',
      price: 30000,
      description: 'Mie goreng dengan telur dan ayam'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#d4462d] text-center mb-8">MENU KAMI</h1>
        
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Special Coffee */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Kopi Spesial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialCoffees.map((coffee, index) => (
              <ProductCard key={index} {...coffee} />
            ))}
          </div>
        </div>

        {/* Snacks */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Cemilan Favorite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {snacks.map((snack, index) => (
              <ProductCard key={index} {...snack} />
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Makan Kenyang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {meals.map((meal, index) => (
              <ProductCard key={index} {...meal} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
