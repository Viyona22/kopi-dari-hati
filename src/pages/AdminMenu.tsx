
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MenuManagement } from '@/components/admin/MenuManagement';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminMenu = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <MenuManagement />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminMenu;
