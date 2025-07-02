
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function AdminHeader() {
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout berhasil. Sampai jumpa!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Terjadi kesalahan saat logout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d4462d] to-[#c23e2d] bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Selamat datang kembali, {userProfile?.full_name || 'Admin'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          
          <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#d4462d] to-[#c23e2d] rounded-full shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{userProfile?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 border-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-300 rounded-xl px-4 py-2 shadow-sm" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
