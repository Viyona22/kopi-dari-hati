import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const reservationSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  guests: z.number().min(1),
  date: z.string(),
  time: z.string(),
  specialRequests: z.string().optional()
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema)
  });

  const onSubmit = (data: ReservationFormData) => {
    console.log(data);
  };

  return (
    <div className="bg-[rgba(217,217,217,1)] p-8 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/0643e5146a0294054249c75084f8c0c4d171d7e3?placeholderIfAbsent=true" alt="Logo" className="w-12 h-12 rounded-[30px]" />
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/314b3385779e47575d77a7079eea8043133fc6c0?placeholderIfAbsent=true" alt="Profile" className="w-16 h-16 rounded-full" />
      </div>

      <h2 className="text-2xl font-bold text-[#d4462d] text-center mb-8">RESERVASI MEJA</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input
          {...register('fullName')}
          type="text"
          placeholder="Nama Lengkap"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <input
          {...register('phone')}
          type="tel"
          placeholder="Nomor Telepon"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <input
          {...register('guests', { valueAsNumber: true })}
          type="number"
          placeholder="Jumlah Tamu"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <input
          {...register('date')}
          type="date"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <input
          {...register('time')}
          type="time"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
        />

        <textarea
          {...register('specialRequests')}
          placeholder="Permintaan Khusus"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          rows={4}
        />

        <button
          type="submit"
          className="w-full bg-[rgba(212,70,45,0.5)] text-[#d4462d] font-bold text-xl py-2 rounded-lg"
        >
          Kirim Reservasi
        </button>
      </form>
    </div>
  );
}
