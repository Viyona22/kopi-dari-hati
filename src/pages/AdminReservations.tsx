
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ReservationTable } from '@/components/admin/ReservationTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminReservations = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <ReservationTable />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminReservations;
