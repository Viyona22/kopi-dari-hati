
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NotificationDropdown } from './NotificationDropdown';

export function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin login status
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    toast.success('Logout berhasil. Sampai jumpa!');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>
          <p className="hidden md:block text-sm text-gray-600 font-medium">
            Selamat datang kembali di panel admin
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          
          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-center w-8 h-8 bg-[#d4462d] rounded-full">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
