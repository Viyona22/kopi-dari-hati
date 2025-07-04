
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-[#d4462d] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau tidak ada.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Halaman Sebelumnya
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            className="w-full bg-[#d4462d] hover:bg-[#b33a25] flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-600">
            <strong>Debug Info:</strong><br />
            Attempted Route: {location.pathname}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
