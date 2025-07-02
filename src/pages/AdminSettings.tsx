
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSettingsContent } from '@/components/admin/AdminSettingsContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminSettings = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
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
    </ProtectedRoute>
  );
};

export default AdminSettings;
