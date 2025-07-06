
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from './AuthProvider';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login for:', email);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Admin login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          setError('Email atau password salah. Pastikan Anda adalah admin yang terdaftar.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi. Silakan cek email Anda.');
        } else {
          setError(error.message);
        }
      } else if (data?.user) {
        console.log('Admin login successful for:', data.user.email);
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('Admin auth error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-[#d4462d]">
          Admin Login
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

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
                Masuk...
              </>
            ) : (
              'Masuk sebagai Admin'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
