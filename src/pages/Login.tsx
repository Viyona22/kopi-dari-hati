
import React, { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { LoginForm } from '../components/auth/LoginForm';
import { CustomerAuthForm } from '../components/auth/CustomerAuthForm';
import { useAuthContext } from '../components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { userProfile, loading } = useAuthContext();
  const navigate = useNavigate();

  // Handle redirect for already logged in users
  useEffect(() => {
    if (!loading && userProfile) {
      console.log('User already logged in on login page:', userProfile);
      const redirectPath = userProfile.role === 'admin' ? '/admin' : '/history';
      navigate(redirectPath, { replace: true });
    }
  }, [userProfile, loading, navigate]);

  // Show simple loading for faster response
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4462d] mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Memuat...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render login form if user is already authenticated
  if (userProfile) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#d4462d]">
                Pilih Jenis Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="customer">
                  <CustomerAuthForm />
                </TabsContent>
                
                <TabsContent value="admin">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                      Khusus untuk administrator yang sudah terdaftar
                    </p>
                  </div>
                  <LoginForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
