import React from 'react';
import { Layout } from '../components/layout/Layout';
import { LoginForm } from '../components/auth/LoginForm';
import { ReservationForm } from '../components/reservation/ReservationForm';
import { ProductCard } from '../components/menu/ProductCard';
import { SearchBar } from '../components/ui/SearchBar';
import { ServiceCard } from '../components/ui/ServiceCard';

export default function Index() {
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
    // Add all other coffee items...
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
    // Add all other snack items...
  ];

  const meals = [
    {
      image: 'https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/a87859f430c9606fa779269879c949fad50d3f35?placeholderIfAbsent=true',
      name: 'Original Beef Bowl',
      price: 40000,
      description: 'Slice beef premium dimasak dengan soy sauce ditambah dengan telur mata sapi'
    },
    // Add all other meal items...
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-[rgba(217,217,217,1)] rounded-lg p-8 text-center mb-16">
          <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true" alt="Logo" className="w-[72px] mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-[#d4462d] mb-4">
            Kopi dari Hati & Toast Bangka
          </h1>
          <p className="text-[#d4462d] mb-6">
            "Pengalaman kopi dan camilan autentik dengan cita rasa Bangka yang tak terlupakan"
          </p>
          <p className="text-[#d4462d]">
            "Kamu Obsesi Paling Indah dari Hati"
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <button className="bg-[rgba(227,167,107,0.24)] text-[#d4462d] font-bold px-6 py-2 rounded-full">
              RESERVASI MEJA
            </button>
            <button className="bg-[rgba(227,167,107,0.24)] text-[#d4462d] font-bold px-6 py-2 rounded-full">
              MENU
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-[#d4462d] text-center mb-8">
            LAYANAN KAMI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/d5153299a283549222243f3872ff1321b4a8ba8f?placeholderIfAbsent=true"
              title="Reservasi Online"
              description="Pesan meja Anda secara online kapan saja, di mana saja dengan sistem reservasi kami yang mudah digunakan."
            />
            <ServiceCard
              icon="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/7c2bddefa4c580122d4f9b27e9b46a9df5680ce1?placeholderIfAbsent=true"
              title="Acara Pribadi"
              description="Sempurnakan acara Anda dengan layanan katering dan ruang acara pribadi kami."
            />
            <ServiceCard
              icon="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/71b7d46855edeff26ba06058e5b35f1391bc2f76?placeholderIfAbsent=true"
              title="Konfirmasi Email"
              description="Dapatkan konfirmasi reservasi langsung ke email Anda untuk kenyamanan Anda."
            />
          </div>
        </section>

        {/* Menu Sections */}
        <section className="mb-16">
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
          <div>
            <h2 className="text-xl font-bold text-[#d4462d] mb-6">Makan Kenyang</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal, index) => (
                <ProductCard key={index} {...meal} />
              ))}
            </div>
          </div>
        </section>

        {/* Atmosphere Section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-[#d4462d] text-center mb-8">
            SUASANA KOPI DARI HATI BANGKA
          </h2>
          <div className="flex justify-center gap-8">
            <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff4315eb0da02eb482b73b7cdf84a06c67a301e2?placeholderIfAbsent=true" alt="Atmosphere 1" className="w-[163px] h-[240px] object-cover" />
            <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/eedabfc471dd01fb886ab3e7cd5be0c6759d4d3d?placeholderIfAbsent=true" alt="Atmosphere 2" className="w-[163px] h-[240px] object-cover" />
          </div>
        </section>

        {/* Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoginForm />
          <ReservationForm />
        </div>
      </div>
    </Layout>
  );
}
