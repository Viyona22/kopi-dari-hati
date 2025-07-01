
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from './AuthProvider';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuthContext();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error('Email atau password salah. Silakan coba lagi.');
      } else {
        toast.success('Login berhasil! Selamat datang Admin.');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="bg-[rgba(217,217,217,1)] p-8 rounded-lg relative">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/840f8e820466cd972c9227284f37450b12ef6ca7?placeholderIfAbsent=true" className="w-44 rounded-full mb-6" alt="Login" />
        <h2 className="text-2xl font-black text-[#df5353] mb-2">Login Admin</h2>
        <p className="text-lg text-[#df5353] mb-2">Masuk ke panel admin</p>
        <p className="text-sm text-[#df5353] opacity-75 text-center">Hanya untuk staff/admin restoran</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email Admin"
            className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password Admin"
            className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#df5353] text-white font-bold py-3 px-4 rounded hover:bg-[#c84444] transition-colors"
        >
          Masuk sebagai Admin
        </button>
      </form>
    </div>
  );
}
