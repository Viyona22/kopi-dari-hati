
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PurchaseTable } from '@/components/admin/PurchaseTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminPurchases = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <PurchaseTable />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminPurchases;
