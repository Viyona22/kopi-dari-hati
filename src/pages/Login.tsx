
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { LoginForm } from '../components/auth/LoginForm';
import { CustomerAuthForm } from '../components/auth/CustomerAuthForm';
import { useAuthContext } from '../components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const { userProfile } = useAuthContext();

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (userProfile) {
      window.location.href = userProfile.role === 'admin' ? '/admin' : '/history';
    }
  }, [userProfile]);

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
