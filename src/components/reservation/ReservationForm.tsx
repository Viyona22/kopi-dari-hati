
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReservationData } from '@/hooks/useReservationData';
import { toast } from 'sonner';

const reservationSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  guests: z.number().min(1, 'Minimal 1 tamu'),
  date: z.string().min(1, 'Tanggal harus dipilih'),
  time: z.string().min(1, 'Waktu harus dipilih'),
  specialRequests: z.string().optional()
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const { saveReservation } = useReservationData();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema)
  });

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const reservation = {
        id: Date.now().toString(),
        name: data.fullName,
        date: data.date,
        guests: data.guests,
        time: data.time,
        status: 'Menunggu' as const,
        phone: data.phone,
        email: data.email,
        special_requests: data.specialRequests || null
      };

      await saveReservation(reservation);
      reset();
      toast.success('Reservasi berhasil dikirim!');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Gagal mengirim reservasi');
    }
  };

  return (
    <div className="bg-[rgba(217,217,217,1)] p-8 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/0643e5146a0294054249c75084f8c0c4d171d7e3?placeholderIfAbsent=true" alt="Logo" className="w-12 h-12 rounded-[30px]" />
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/314b3385779e47575d77a7079eea8043133fc6c0?placeholderIfAbsent=true" alt="Profile" className="w-16 h-16 rounded-full" />
      </div>

      <h2 className="text-2xl font-bold text-[#d4462d] text-center mb-8">RESERVASI MEJA</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register('fullName')}
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Nomor Telepon"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('guests', { valueAsNumber: true })}
            type="number"
            placeholder="Jumlah Tamu"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('date')}
            type="date"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('time')}
            type="time"
            className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
          )}
        </div>

        <textarea
          {...register('specialRequests')}
          placeholder="Permintaan Khusus (opsional)"
          className="w-full p-3 rounded-lg bg-white text-[#d4462d] font-bold"
          rows={4}
        />

        <button
          type="submit"
          className="w-full bg-[rgba(212,70,45,0.5)] text-[#d4462d] font-bold text-xl py-2 rounded-lg hover:bg-[rgba(212,70,45,0.7)] transition-colors"
        >
          Kirim Reservasi
        </button>
      </form>
    </div>
  );
}
