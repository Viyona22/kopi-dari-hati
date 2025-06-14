
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../components/ui/ServiceCard';

export default function Index() {
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
            <Link to="/reservation" className="bg-[rgba(227,167,107,0.24)] text-[#d4462d] font-bold px-6 py-2 rounded-full">
              RESERVASI MEJA
            </Link>
            <Link to="/menu" className="bg-[rgba(227,167,107,0.24)] text-[#d4462d] font-bold px-6 py-2 rounded-full">
              MENU
            </Link>
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

        {/* Atmosphere Section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-[#d4462d] text-center mb-8">
            SUASANA KOPI DARI HATI BANGKA
          </h2>
          <div className="flex justify-center gap-8">
            <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff4315eb0da02eb482b73b7cdf84a06c67a301e2?placeholderIfAbsent=true" alt="Atmosphere 1" className="w-[163px] h-[240px] object-cover rounded-lg" />
            <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/eedabfc471dd01fb886ab3e7cd5be0c6759d4d3d?placeholderIfAbsent=true" alt="Atmosphere 2" className="w-[163px] h-[240px] object-cover rounded-lg" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
