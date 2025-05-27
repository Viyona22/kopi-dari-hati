
import React from 'react';
import { SummaryCards } from './SummaryCards';
import { ReservationTable } from './ReservationTable';
import { PurchaseTable } from './PurchaseTable';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      <div className="grid gap-6">
        <ReservationTable />
        <PurchaseTable />
      </div>
    </div>
  );
}
