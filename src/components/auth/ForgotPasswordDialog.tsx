
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid')
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        toast.error('Gagal mengirim email reset password. Silakan coba lagi.');
      } else {
        toast.success('Link reset password telah dikirim ke email Anda!');
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
        <span className="text-[#df5353] text-base cursor-pointer hover:underline">
          Forget password?
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#df5353]">Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#df5353] text-white font-bold py-3 px-4 rounded hover:bg-[#c84444] transition-colors disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
