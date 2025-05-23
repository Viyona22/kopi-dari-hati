
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/menu/ProductCard';
import { SearchBar } from '../components/ui/SearchBar';

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState('');
  
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
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8e02a424a750a7553ffc5cec6452aa9349e21fa2?placeholderIfAbsent=true',
      name: 'Ice Lemon Tea',
      price: 18000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/9413fb82294f3f5a0c9e90c179c1a17772cb881e?placeholderIfAbsent=true',
      name: 'Hot Cappuccino',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/013e1d29df3651efe87d10af7f9776f73ce1a636?placeholderIfAbsent=true',
      name: 'Hot Americano',
      price: 20000
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
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/2db510491c5c242178580c22a0016223b9a38926?placeholderIfAbsent=true',
      name: 'Kentang Goreng',
      price: 15000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c51e0c3eeb558bde1bb4753be7a5b92e54f2ba7c?placeholderIfAbsent=true',
      name: 'Cireng Bumbu',
      price: 12000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c1fa0c53907bc6a0ed4b8a4f8c021f89ae77e840?placeholderIfAbsent=true',
      name: 'Bakwan Jagung',
      price: 10000
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
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d4e9062045a4da629131c19a7184d5ce3b29ea90?placeholderIfAbsent=true',
      name: 'Nasi Goreng Bangka',
      price: 28000,
      description: 'Nasi goreng khas Bangka dengan bumbu tradisional'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/e9330a9790fc2ba1f1bdeae3ac51518dd0b62132?placeholderIfAbsent=true',
      name: 'Kwetiau Goreng',
      price: 32000,
      description: 'Kwetiau goreng dengan seafood dan sayuran'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/386ef893cca6e9ebb7e78a656f2e31aa2bdb6ee8?placeholderIfAbsent=true',
      name: 'Bubur Ayam',
      price: 25000,
      description: 'Bubur ayam dengan topping lengkap'
    }
  ];

  const specialDrinks = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/56e389493465126608506ed4b0beb63a1a0cd709?placeholderIfAbsent=true',
      name: 'Strawberry Smoothie',
      price: 28000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f1cbed3faaf6c4f43ac7f34d84077e488475a06c?placeholderIfAbsent=true',
      name: 'Taro Milk Tea',
      price: 26000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/12b29b8e9a71aa9af8c87dc56c7f849c39b8a234?placeholderIfAbsent=true',
      name: 'Green Tea Latte',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d2c4d1e2161694b025810a5179c2b016ff081a0b?placeholderIfAbsent=true',
      name: 'Mango Juice',
      price: 22000
    }
  ];

  const desserts = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/88ce0d05767d77f17dd4a3b5ba15c9919cd3a872?placeholderIfAbsent=true',
      name: 'Es Krim Vanilla',
      price: 15000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/9e2eeee73cb0f0d9e44daa583eed8c28142eb4d8?placeholderIfAbsent=true',
      name: 'Pancake',
      price: 20000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f6d030df9bdb9fd278cd97a58df38870abd993b4?placeholderIfAbsent=true',
      name: 'Pudding Karamel',
      price: 18000
    }
  ];

  const paketHemat = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/5d1c9e6810d7423581fb4b01e672a23185399d2d?placeholderIfAbsent=true',
      name: 'Paket Komplit A',
      price: 45000,
      description: 'Nasi goreng + Es teh manis'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff6ea497c726e954a0056d8a586b8b5d881fb220?placeholderIfAbsent=true',
      name: 'Paket Komplit B',
      price: 50000,
      description: 'Mie goreng spesial + Ice lemon tea'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/cdd930d102ff2f8f4e07b9e3ce4b240c28a23cf0?placeholderIfAbsent=true',
      name: 'Paket Kenyang',
      price: 60000,
      description: 'Original beef bowl + Ice kopi susu'
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

        {/* Special Drinks */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Minuman Spesial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialDrinks.map((drink, index) => (
              <ProductCard key={index} {...drink} />
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

        {/* Desserts */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Dessert</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {desserts.map((dessert, index) => (
              <ProductCard key={index} {...dessert} />
            ))}
          </div>
        </div>

        {/* Package Deals */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#d4462d] mb-6">Paket Hemat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paketHemat.map((paket, index) => (
              <ProductCard key={index} {...paket} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
