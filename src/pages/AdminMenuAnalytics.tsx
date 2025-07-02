
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MenuAnalyticsDashboard } from '@/components/admin/MenuAnalyticsDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminMenuAnalytics = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Menu Analytics</h1>
                <p className="text-gray-600">Analisis performa menu, favorit, dan rating pelanggan</p>
              </div>
              <MenuAnalyticsDashboard />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminMenuAnalytics;
