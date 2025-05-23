import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[rgba(227,167,107,0.24)] py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-[#d4462d] text-sm">
          <h3 className="font-bold mb-4">Hubungi Kami</h3>
          <p>Jalan Air Cauyan RT 19 (Alun-alun Koba)</p>
          <p>Koba, Bangka Tengah, Bangka Belitung, Indonesia</p>
          <p>Phone: 087861616363</p>
          <p>Email: info@kopidarihatibangka.com</p>
        </div>
        <div className="text-[#d4462d] text-sm">
          <h3 className="font-bold mb-4">Jam Buka</h3>
          <p>Jumat - Rabu: 16:00 - 23:00</p>
          <p>Kamis: Tutup</p>
        </div>
      </div>
    </footer>
  );
}
