
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export function CustomerAuthForm() {
  const navigate = useNavigate();
  const { signIn, signUp, userProfile } = useAuthContext();
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
      console.log('User already logged in, redirecting...', userProfile);
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/history');
      }
    }
  }, [userProfile, navigate]);

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', data.email);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Email atau password salah. Silakan coba lagi.');
      } else {
        console.log('Login successful');
        toast.success('Login berhasil!');
        // Navigation will be handled by the useEffect above when userProfile updates
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      console.log('Attempting signup for:', data.email, data.fullName);
      // Always create customer accounts through this form
      const { error } = await signUp(data.email, data.password, data.fullName, 'customer');
      
      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('already registered')) {
          toast.error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        } else {
          toast.error('Gagal mendaftar. Silakan coba lagi.');
        }
      } else {
        console.log('Signup successful');
        toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.');
      }
    } catch (error) {
      console.error('Signup exception:', error);
      toast.error('Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/840f8e820466cd972c9227284f37450b12ef6ca7?placeholderIfAbsent=true" 
          alt="Kopi dari Hati" 
          className="w-20 h-20 mx-auto mb-4 rounded-full"
        />
        <CardTitle className="text-2xl font-bold text-[#d4462d]">
          Kopi dari Hati
        </CardTitle>
        <CardDescription>
          Masuk atau daftar untuk melakukan pemesanan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="signup">Daftar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="Email"
                  disabled={isLoading}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#d4462d] hover:bg-[#c23e2d]"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...signUpForm.register('fullName')}
                  placeholder="Nama Lengkap"
                  disabled={isLoading}
                />
                {signUpForm.formState.errors.fullName && (
                  <p className="text-sm text-red-500">
                    {signUpForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signUpForm.register('email')}
                  type="email"
                  placeholder="Email"
                  disabled={isLoading}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signUpForm.register('password')}
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signUpForm.register('confirmPassword')}
                  type="password"
                  placeholder="Konfirmasi Password"
                  disabled={isLoading}
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#d4462d] hover:bg-[#c23e2d]"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
