
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Header() {
  const { getTotalItems } = useCart();
  const { user, userProfile, signOut } = useAuthContext();
  const navigate = useNavigate();
  const cartItemCount = getTotalItems();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Logout berhasil');
      navigate('/');
    }
  };

  return (
    <header className="bg-[#f9f5f0] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true"
            alt="Logo" 
            className="w-10 h-10 mr-2 rounded-full" 
          />
          <span className="text-[#d4462d] font-bold">Kopi dari Hati</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="text-[#d4462d] hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="text-[#d4462d] hover:underline">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/reservation" className="text-[#d4462d] hover:underline">
                Reservation
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link to="/history" className="text-[#d4462d] hover:underline">
                    Riwayat Saya
                  </Link>
                </li>
                {userProfile?.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="text-[#d4462d] hover:underline">
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/cart" className="text-[#d4462d] hover:underline relative">
                    <ShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#d4462d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-[#d4462d]">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{userProfile?.full_name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-[#d4462d] border-[#d4462d] hover:bg-[#d4462d] hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-[#d4462d] hover:underline">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
