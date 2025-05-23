
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/menu/ProductCard';
import { SearchBar } from '../components/ui/SearchBar';

export default function Menu() {
  const [activeTab, setActiveTab] = useState('kopi');
  
  // Kopi Special menu items from your first screenshot
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
      name: 'Ice Coffee Shake',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8e02a424a750a7553ffc5cec6452aa9349e21fa2?placeholderIfAbsent=true',
      name: 'Ice Red Velvet Latte',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/9413fb82294f3f5a0c9e90c179c1a17772cb881e?placeholderIfAbsent=true',
      name: 'Ice Double Mocha',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/013e1d29df3651efe87d10af7f9776f73ce1a636?placeholderIfAbsent=true',
      name: 'Hot Americano',
      price: 20000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f1cbed3faaf6c4f43ac7f34d84077e488475a06c?placeholderIfAbsent=true',
      name: 'Hot Cappuccino',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/12b29b8e9a71aa9af8c87dc56c7f849c39b8a234?placeholderIfAbsent=true',
      name: 'Hot Coffee Latte',
      price: 25000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d2c4d1e2161694b025810a5179c2b016ff081a0b?placeholderIfAbsent=true',
      name: 'Hot Espresso',
      price: 20000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/88ce0d05767d77f17dd4a3b5ba15c9919cd3a872?placeholderIfAbsent=true',
      name: 'Le Mineral',
      price: 8000
    }
  ];

  // Cemilan Favorite menu items from your second screenshot
  const snacks = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f10dffeee6529562c0b99f546f2f4c96cdb9ba5e?placeholderIfAbsent=true',
      name: 'Pisang Coklat',
      price: 10000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/4a0a584836e3ce06c11dffacb9dcd5522a6327a0?placeholderIfAbsent=true',
      name: 'Otak-otak Bakar',
      price: 15000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f0f4fd16a6d97a6dc113a44c15964b892a116c50?placeholderIfAbsent=true',
      name: 'Tteokbokki',
      price: 20000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/2db510491c5c242178580c22a0016223b9a38926?placeholderIfAbsent=true',
      name: 'Mie Tek-tek',
      price: 15000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c51e0c3eeb558bde1bb4753be7a5b92e54f2ba7c?placeholderIfAbsent=true',
      name: 'Nugget Goreng',
      price: 12000
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/c1fa0c53907bc6a0ed4b8a4f8c021f89ae77e840?placeholderIfAbsent=true',
      name: 'Kentang Goreng',
      price: 15000
    }
  ];

  // Makan Kenyang menu items from your third screenshot
  const meals = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a87859f430c9606fa779269879c949fad50d3f35?placeholderIfAbsent=true',
      name: 'Original Beef Bowl',
      price: 40000,
      description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/730370f0e60278cceaf5ec3c12a79f907705529e?placeholderIfAbsent=true',
      name: 'Teriyaki Beef Bowl',
      price: 40000,
      description: 'Slice beef premium dimasak dengan saus teriyaki ditambah telur mata sapi'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/023b16447e0cb928a69a828370ebd31bba33b8e3?placeholderIfAbsent=true',
      name: 'Original Beef Bowl Special',
      price: 45000,
      description: 'Original beef bowl dengan tambahan sayuran dan keju'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d4e9062045a4da629131c19a7184d5ce3b29ea90?placeholderIfAbsent=true',
      name: 'Beef Bowl with Special Sauce',
      price: 45000,
      description: 'Beef bowl dengan saus spesial kopi dari hati'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/e9330a9790fc2ba1f1bdeae3ac51518dd0b62132?placeholderIfAbsent=true',
      name: 'Nasi Goreng Special',
      price: 30000,
      description: 'Nasi goreng dengan telur mata sapi dan ayam'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/386ef893cca6e9ebb7e78a656f2e31aa2bdb6ee8?placeholderIfAbsent=true',
      name: 'Mie Goreng Special',
      price: 30000,
      description: 'Mie goreng dengan telur dan ayam'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/56e389493465126608506ed4b0beb63a1a0cd709?placeholderIfAbsent=true',
      name: 'Mie Koba Bangka Original',
      price: 25000,
      description: 'Mie khas Bangka dengan bakso ikan dan sayuran'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/f1cbed3faaf6c4f43ac7f34d84077e488475a06c?placeholderIfAbsent=true',
      name: 'Beef Maki Special Mushroom',
      price: 45000,
      description: 'Beef roll dengan jamur spesial'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/12b29b8e9a71aa9af8c87dc56c7f849c39b8a234?placeholderIfAbsent=true',
      name: 'Nasi Ayam Geprek',
      price: 25000,
      description: 'Nasi dengan ayam geprek pedas'
    },
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d2c4d1e2161694b025810a5179c2b016ff081a0b?placeholderIfAbsent=true',
      name: 'Nasi Cabe Gilingan',
      price: 28000,
      description: 'Nasi dengan sambal cabe gilingan dan lauk'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#d4462d] text-center mb-2">MENU KAMI</h1>
        <p className="text-[#d4462d] text-center mb-8 italic">Nikmati berbagai hidangan kopi dan camilan khas Bangka dengan sentuhan modern</p>
        
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Menu tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          <button 
            onClick={() => setActiveTab('kopi')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'kopi' ? 'bg-[#d4462d] text-white' : 'bg-gray-200 text-[#d4462d]'}`}
          >
            Kopi Special
          </button>
          <button 
            onClick={() => setActiveTab('cemilan')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'cemilan' ? 'bg-[#d4462d] text-white' : 'bg-gray-200 text-[#d4462d]'}`}
          >
            Cemilan Favorite
          </button>
          <button 
            onClick={() => setActiveTab('makanan')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'makanan' ? 'bg-[#d4462d] text-white' : 'bg-gray-200 text-[#d4462d]'}`}
          >
            Makan Kenyang
          </button>
        </div>

        {/* Kopi Special */}
        {activeTab === 'kopi' && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#d4462d] mb-6">Kopi Spesial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialCoffees.map((coffee, index) => (
                <ProductCard key={index} {...coffee} />
              ))}
            </div>
          </div>
        )}

        {/* Cemilan Favorite */}
        {activeTab === 'cemilan' && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#d4462d] mb-6">Cemilan Favorite</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {snacks.map((snack, index) => (
                <ProductCard key={index} {...snack} />
              ))}
            </div>
          </div>
        )}

        {/* Makan Kenyang */}
        {activeTab === 'makanan' && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#d4462d] mb-6">Makan Kenyang</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal, index) => (
                <ProductCard key={index} {...meal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
