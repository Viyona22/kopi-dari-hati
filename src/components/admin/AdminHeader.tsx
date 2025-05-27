
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Kopi dari Hati Admin Panel
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Admin</span>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
