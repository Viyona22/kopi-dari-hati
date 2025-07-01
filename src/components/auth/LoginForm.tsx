import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthService } from '@/services/authService';
import { ProfileService } from '@/services/profileService';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

const signUpSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn, userProfile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (userProfile) {
      console.log('Admin already logged in, redirecting...', userProfile);
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/history');
      }
    }
  }, [userProfile, navigate]);

  const handleFixAdminAccount = async (email: string) => {
    try {
      console.log('Attempting to fix admin account for:', email);
      const result = await ProfileService.fixAdminAccount(email);
      if (result.success) {
        toast.success('Admin account berhasil diperbaiki! Silakan coba login lagi.');
      } else {
        toast.error(result.message || 'Gagal memperbaiki admin account.');
      }
    } catch (error) {
      console.error('Error fixing admin account:', error);
      toast.error('Terjadi kesalahan saat memperbaiki admin account.');
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      const { error } = await AuthService.resendConfirmation(email);
      if (error) {
        toast.error('Gagal mengirim ulang email konfirmasi.');
      } else {
        toast.success('Email konfirmasi telah dikirim ulang! Silakan cek email Anda.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim email konfirmasi.');
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('Admin login attempt for:', data.email);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Admin login error:', error);
        
        if (error.message.includes('Email not confirmed')) {
          toast.error(
            'Email belum dikonfirmasi. Silakan cek email Anda.',
            {
              action: {
                label: 'Kirim Ulang',
                onClick: () => handleResendConfirmation(data.email)
              }
            }
          );
        } else if (error.message.includes('Invalid login credentials')) {
          // Check if this might be an existing admin that needs fixing
          if (data.email === 'kopidarihati@gmail.com') {
            toast.error(
              'Login gagal. Mungkin akun admin perlu diperbaiki.',
              {
                action: {
                  label: 'Perbaiki Akun',
                  onClick: () => handleFixAdminAccount(data.email)
                }
              }
            );
          } else {
            toast.error('Email atau password salah. Silakan coba lagi atau daftar sebagai admin baru.');
          }
        } else {
          toast.error('Gagal login: ' + error.message);
        }
      } else {
        console.log('Admin login successful');
        toast.success('Login berhasil! Selamat datang Admin.');
        // Navigation will be handled by the useEffect above when userProfile updates
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      toast.error('Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      console.log('Admin signup attempt for:', data.email, data.fullName);
      const result = await AuthService.signUp(data.email, data.password, data.fullName, 'admin');
      
      if (result.error) {
        console.error('Admin signup error:', result.error);
        if (result.error.message?.includes('already registered') || result.error.message?.includes('already exists')) {
          toast.error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        } else if (result.error.message?.includes('Password should be at least')) {
          toast.error('Password harus minimal 6 karakter.');
        } else if (result.error.message?.includes('Invalid email')) {
          toast.error('Format email tidak valid.');
        } else {
          toast.error('Gagal mendaftar: ' + result.error.message);
        }
      } else if (result.needsConfirmation) {
        console.log('Admin signup successful, needs email confirmation');
        toast.success(
          'Pendaftaran admin berhasil! Silakan cek email Anda untuk konfirmasi sebelum login.',
          {
            action: {
              label: 'Kirim Ulang Email',
              onClick: () => handleResendConfirmation(data.email)
            }
          }
        );
        signUpForm.reset();
      } else {
        console.log('Admin signup successful');
        toast.success('Pendaftaran admin berhasil! Anda sekarang dapat login.');
        signUpForm.reset();
      }
    } catch (error) {
      console.error('Admin signup exception:', error);
      toast.error('Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = loginForm.getValues('email');
    if (!email) {
      toast.error('Silakan masukkan email terlebih dahulu.');
      return;
    }

    try {
      const { error } = await AuthService.resetPassword(email);
      if (error) {
        toast.error('Gagal mengirim email reset password.');
      } else {
        toast.success('Email reset password telah dikirim!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim email reset.');
    }
  };

  return (
    <div className="bg-[rgba(217,217,217,1)] p-8 rounded-lg relative">
      <div className="flex flex-col items-center mb-8">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/840f8e820466cd972c9227284f37450b12ef6ca7?placeholderIfAbsent=true" className="w-44 rounded-full mb-6" alt="Login" />
        <h2 className="text-2xl font-black text-[#df5353] mb-2">Panel Admin</h2>
        <p className="text-lg text-[#df5353] mb-2">Masuk atau daftar sebagai admin</p>
        <p className="text-sm text-[#df5353] opacity-75 text-center">Hanya untuk staff/admin restoran</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Masuk Admin</TabsTrigger>
          <TabsTrigger value="signup">Daftar Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <Input
                {...loginForm.register('email')}
                type="email"
                placeholder="Email Admin"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                {...loginForm.register('password')}
                type="password"
                placeholder="Password Admin"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#df5353] text-white font-bold py-3 px-4 rounded hover:bg-[#c84444] transition-colors"
            >
              {isLoading ? 'Memproses...' : 'Masuk sebagai Admin'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResetPassword}
              className="w-full border-[#df5353] text-[#df5353] hover:bg-[#df5353] hover:text-white"
            >
              Lupa Password?
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
            <div>
              <Input
                {...signUpForm.register('fullName')}
                placeholder="Nama Lengkap Admin"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {signUpForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Input
                {...signUpForm.register('email')}
                type="email"
                placeholder="Email Admin"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                {...signUpForm.register('password')}
                type="password"
                placeholder="Password Admin"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Input
                {...signUpForm.register('confirmPassword')}
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full p-3 rounded border border-[#df5353] bg-white text-[#df5353] font-bold"
                disabled={isLoading}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#df5353] text-white font-bold py-3 px-4 rounded hover:bg-[#c84444] transition-colors"
            >
              {isLoading ? 'Memproses...' : 'Daftar sebagai Admin'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
