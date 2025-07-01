
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from './AuthProvider';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { ProfileService } from '@/services/profileService';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { data, error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            setError('Email atau password salah. Pastikan Anda sudah terdaftar dan menggunakan kredensial yang benar.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Email belum dikonfirmasi. Silakan cek email Anda.');
          } else {
            setError(error.message);
          }
        } else if (data?.user) {
          console.log('Login successful for:', data.user.email);
          setSuccess('Login berhasil! Mengarahkan...');
          
          // Redirect based on user role will be handled by useAuth
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } else {
        console.log('Attempting registration for:', email);
        const { data, error } = await signUp(email, password, fullName, 'admin');
        
        if (error) {
          console.error('Registration error:', error);
          
          if (error.message.includes('User already registered')) {
            setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
          } else if (error.message.includes('Password should be at least 6 characters')) {
            setError('Password harus minimal 6 karakter.');
          } else {
            setError(error.message);
          }
        } else if (data?.user) {
          console.log('Registration successful for:', data.user.email);
          setSuccess('Registrasi berhasil! Akun admin telah dibuat. Silakan login.');
          
          // Switch to login mode
          setTimeout(() => {
            setIsLogin(true);
            setError('');
            setPassword('');
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFixAccount = async () => {
    if (!email) {
      setError('Masukkan email terlebih dahulu');
      return;
    }
    
    setLoading(true);
    try {
      const result = await ProfileService.fixAdminAccount(email);
      if (result.success) {
        setSuccess('Akun berhasil diperbaiki! Silakan login kembali.');
      } else {
        setError(result.message || 'Gagal memperbaiki akun');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memperbaiki akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-[#d4462d]">
          {isLogin ? 'Admin Login' : 'Daftar Admin Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#d4462d] hover:bg-[#b8391a]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Masuk...' : 'Mendaftar...'}
              </>
            ) : (
              isLogin ? 'Masuk' : 'Daftar Admin'
            )}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-[#d4462d]"
            >
              {isLogin ? 'Belum punya akun admin? Daftar' : 'Sudah punya akun? Login'}
            </Button>

            {isLogin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFixAccount}
                disabled={loading}
                className="text-xs"
              >
                Perbaiki Akun Admin
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
