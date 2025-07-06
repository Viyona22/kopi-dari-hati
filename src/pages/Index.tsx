
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { ServiceCard } from '../components/ui/ServiceCard';
import { MenuCarousel } from '../components/home/MenuCarousel';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Index() {
  const isMobile = useIsMobile();
  const { 
    cafeName, 
    cafeTagline, 
    cafeDescription, 
    cafeLogo, 
    atmosphereImages,
    loading 
  } = useCafeSettings();

  console.log('Index component render - loading:', loading, 'cafeName:', cafeName);

  // Use dynamic logo or fallback to existing
  const logoSrc = cafeLogo || "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true";
  
  // Prioritize uploaded atmosphere images, fallback to existing ones
  let displayImages = [];
  
  if (atmosphereImages && atmosphereImages.length > 0) {
    // Use uploaded images from admin
    displayImages = atmosphereImages;
  } else {
    // Fallback to existing images
    displayImages = [
      "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff4315eb0da02eb482b73b7cdf84a06c67a301e2?placeholderIfAbsent=true",
      "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/eedabfc471dd01fb886ab3e7cd5be0c6759d4d3d?placeholderIfAbsent=true"
    ];
  }

  // Reduced loading time and improved user experience
  if (loading) {
    console.log('Index component showing loading state');
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4462d] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </Layout>
    );
  }

  console.log('Index component rendering main content');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className={`bg-[#d9d9d9] rounded-lg ${isMobile ? 'p-6' : 'p-8'} text-center mb-16`}>
          <img 
            src={logoSrc} 
            alt="Logo" 
            className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} mx-auto mb-4 rounded-full object-cover`} 
            onError={(e) => {
              console.log('Logo failed to load, using fallback');
              const target = e.target as HTMLImageElement;
              if (target && target.src !== "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true") {
                target.src = "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true";
              }
            }}
            loading="lazy"
          />
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-[#d4462d] mb-4`}>
            {cafeName || 'Kopi dari Hati'}
          </h1>
          <p className={`text-[#d4462d] mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
            "{cafeDescription || 'Pengalaman kopi dan camilan autentik dengan cita rasa Bangka yang tak terlupakan'}"
          </p>
          <p className={`text-[#d4462d] ${isMobile ? 'text-sm' : 'text-base'}`}>
            "{cafeTagline || 'Kamu Obsesi Paling Indah dari Hati'}"
          </p>
          
          <div className={`flex justify-center mt-8 ${isMobile ? 'flex-col gap-3' : 'gap-4'}`}>
            <Link 
              to="/reservation" 
              className={`bg-[rgba(227,167,107,0.24)] text-[#d4462d] font-bold ${isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-2'} rounded-full hover:bg-[rgba(227,167,107,0.4)] transition-colors`}
            >
              RESERVASI MEJA
            </Link>
            <Link 
              to="/menu" 
              className={`bg-[#d4462d] text-white font-bold ${isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-2'} rounded-full hover:bg-[#c03d2a] transition-colors`}
            >
              LIHAT MENU
            </Link>
          </div>
        </section>

        {/* Menu Carousel Section */}
        <MenuCarousel />

        {/* Services Section */}
        <section className="mb-16">
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
            LAYANAN KAMI
          </h2>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-8'}`}>
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
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#d4462d] text-center mb-8`}>
            SUASANA {(cafeName || 'KOPI DARI HATI').toUpperCase()}
          </h2>
          <div className={`flex justify-center ${isMobile ? 'flex-col items-center gap-4' : 'gap-8'}`}>
            {displayImages.slice(0, 2).map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Suasana ${index + 1}`} 
                className={`${isMobile ? 'w-full max-w-[280px] h-[200px]' : 'w-[200px] h-[240px]'} object-cover rounded-lg shadow-md`} 
                onError={(e) => {
                  // Fallback to default image if uploaded image fails
                  const defaultImages = [
                    "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff4315eb0da02eb482b73b7cdf84a06c67a301e2?placeholderIfAbsent=true",
                    "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/eedabfc471dd01fb886ab3e7cd5be0c6759d4d3d?placeholderIfAbsent=true"
                  ];
                  const target = e.target as HTMLImageElement;
                  if (target && target.src !== defaultImages[index]) {
                    target.src = defaultImages[index] || defaultImages[0];
                  }
                }}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
