
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSettingsContent } from '@/components/admin/AdminSettingsContent';

const AdminSettings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Don't render admin panel if not logged in
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
            <AdminSettingsContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;
