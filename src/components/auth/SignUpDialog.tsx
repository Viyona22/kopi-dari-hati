
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const signUpSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type SignUpData = z.infer<typeof signUpSchema>;

export function SignUpDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        } else {
          toast.error('Gagal mendaftar. Silakan coba lagi.');
        }
      } else {
        toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.');
        setOpen(false);
        reset();
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer hover:underline">Sign up</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#df5353]">Daftar Akun Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#df5353] text-white font-bold py-3 px-4 rounded hover:bg-[#c84444] transition-colors disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
