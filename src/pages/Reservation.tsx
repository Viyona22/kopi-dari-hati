
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ReservationForm } from '../components/reservation/ReservationForm';

export default function Reservation() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#d4462d] text-center mb-8">RESERVASI MEJA</h1>
        
        <div className="max-w-md mx-auto">
          <ReservationForm />
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-[#d4462d] mb-4">Jam Operasional</h2>
          <p className="text-[#d4462d]">Jumat - Rabu: 16:00 - 23:00</p>
          <p className="text-[#d4462d]">Kamis: Tutup</p>
        </div>
      </div>
    </Layout>
  );
}
