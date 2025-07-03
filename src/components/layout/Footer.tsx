
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className="bg-[rgba(227,167,107,0.24)] py-8">
      <div className={`container mx-auto px-4 grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-8'}`}>
        <div className={`text-[#d4462d] ${isMobile ? 'text-center' : ''} ${isMobile ? 'text-sm' : 'text-sm'}`}>
          <h3 className="font-bold mb-4">Hubungi Kami</h3>
          <p className={isMobile ? 'mb-2' : ''}>Jalan Air Cauyan RT 19 (Alun-alun Koba)</p>
          <p className={isMobile ? 'mb-2' : ''}>Koba, Bangka Tengah, Bangka Belitung, Indonesia</p>
          <p className={isMobile ? 'mb-2' : ''}>Phone: 087861616363</p>
          <p>Email: info@kopidarihatibangka.com</p>
        </div>
        <div className={`text-[#d4462d] ${isMobile ? 'text-center' : ''} ${isMobile ? 'text-sm' : 'text-sm'}`}>
          <h3 className="font-bold mb-4">Jam Buka</h3>
          <p className={isMobile ? 'mb-2' : ''}>Jumat - Rabu: 16:00 - 23:00</p>
          <p>Kamis: Tutup</p>
        </div>
      </div>
    </footer>
  );
}
