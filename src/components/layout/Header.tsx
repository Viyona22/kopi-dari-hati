import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import { ShoppingCart, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { getTotalItems } = useCart();
  const { user, userProfile, signOut } = useAuthContext();
  const { cafeName, cafeLogo } = useCafeSettings();
  const navigate = useNavigate();
  const cartItemCount = getTotalItems();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Logout berhasil');
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Use dynamic logo or fallback to default
  const logoSrc = cafeLogo || "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/8b514823c305a6f7e15578d979e8300b3985302e?placeholderIfAbsent=true";

  if (isMobile) {
    return (
      <header className="bg-[#f9f5f0] py-3 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <img 
              src={logoSrc}
              alt="Logo" 
              className="w-8 h-8 mr-2 rounded-full" 
            />
            <span className="text-[#d4462d] font-bold text-sm">{cafeName}</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            {user && (
              <Link to="/cart" className="text-[#d4462d] relative" onClick={closeMobileMenu}>
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4462d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#d4462d] p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#f9f5f0] border-t border-[#d4462d]/20 shadow-lg z-50">
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="block text-[#d4462d] font-medium py-2 border-b border-[#d4462d]/10"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/menu" 
                    className="block text-[#d4462d] font-medium py-2 border-b border-[#d4462d]/10"
                    onClick={closeMobileMenu}
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/reservation" 
                    className="block text-[#d4462d] font-medium py-2 border-b border-[#d4462d]/10"
                    onClick={closeMobileMenu}
                  >
                    Reservation
                  </Link>
                </li>
                
                {user ? (
                  <>
                    {userProfile?.role === 'customer' && (
                      <li>
                        <Link 
                          to="/history" 
                          className="block text-[#d4462d] font-medium py-2 border-b border-[#d4462d]/10"
                          onClick={closeMobileMenu}
                        >
                          Riwayat Saya
                        </Link>
                      </li>
                    )}
                    {userProfile?.role === 'admin' && (
                      <li>
                        <Link 
                          to="/admin" 
                          className="block text-[#d4462d] font-medium py-2 border-b border-[#d4462d]/10"
                          onClick={closeMobileMenu}
                        >
                          Admin
                        </Link>
                      </li>
                    )}
                    <li className="pt-2">
                      <div className="flex items-center justify-between">
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
                      </div>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/login" 
                      className="block text-[#d4462d] font-medium py-2"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Desktop version
  return (
    <header className="bg-[#f9f5f0] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src={logoSrc}
            alt="Logo" 
            className="w-10 h-10 mr-2 rounded-full" 
          />
          <span className="text-[#d4462d] font-bold">{cafeName}</span>
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
                {userProfile?.role === 'customer' && (
                  <li>
                    <Link to="/history" className="text-[#d4462d] hover:underline">
                      Riwayat Saya
                    </Link>
                  </li>
                )}
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
