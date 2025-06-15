
import React from 'react';
import { SummaryCards } from './SummaryCards';
import { SalesChart } from './SalesChart';
import { PopularMenuChart } from './PopularMenuChart';
import { NotificationPanel } from './NotificationPanel';
import { ReservationTable } from './ReservationTable';
import { PurchaseTable } from './PurchaseTable';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <NotificationPanel />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <PopularMenuChart />
        <div className="space-y-4">
          <ReservationTable />
        </div>
      </div>
      
      <div className="grid gap-6">
        <PurchaseTable />
      </div>
    </div>
  );
}
