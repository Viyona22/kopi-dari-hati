
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Admin = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/30 to-white">
              <div className="max-w-7xl mx-auto">
                <AdminDashboard />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Admin;
