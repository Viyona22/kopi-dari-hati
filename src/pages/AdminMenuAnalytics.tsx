
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MenuAnalyticsDashboard } from '@/components/admin/MenuAnalyticsDashboard';

const AdminMenuAnalytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
  if (!isLoggedIn) {
    return null;
  }

  return (
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
  );
};

export default AdminMenuAnalytics;
